from pathlib import Path
from datetime import datetime, timezone
import json
import numpy as np
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split
import joblib

BASE=Path(__file__).resolve().parent
ART=BASE/'artifacts'; ART.mkdir(exist_ok=True)
MODEL_PATH=ART/'flood_models.joblib'; METRICS_PATH=ART/'metrics.json'
FEATURES=['rainfall_intensity','rainfall_accumulation','forecast_rainfall','elevation','slope','drain_capacity','drain_utilization','blockage_percentage','catchment_area','historical_flood_frequency','distance_to_drain','road_elevation']

def build_dataset(n=1400):
    data_path=BASE/'data'/'synthetic_flood_training.csv'
    if data_path.exists():
        df=pd.read_csv(data_path)
        return df[FEATURES],df['flooded'].astype(int).to_numpy(),df['water_depth'].astype(float).to_numpy()
    rng=np.random.default_rng(26085)
    rainfall=rng.uniform(10,130,n); acc=rng.uniform(5,260,n); forecast=rng.uniform(10,140,n); elevation=rng.uniform(198,250,n); slope=rng.uniform(.5,6,n); drain_cap=rng.uniform(70,160,n)
    util=rng.uniform(35,100,n); blockage=rng.uniform(0,80,n); catchment=rng.uniform(.2,3.5,n); hist=rng.uniform(0,12,n); dist=rng.uniform(.1,2.2,n); road=elevation+rng.normal(0,2,n)
    risk_score=(rainfall*.32+forecast*.25+util*.42+blockage*.35+hist*1.8+(220-elevation)*.5+(2.2-dist)*5); p=np.clip((risk_score-50)/90,.02,.98); y=(p>0.5).astype(int); depth=np.clip(p*1.25+(100-elevation)*.004+rng.normal(0,.035,n),0,.98)
    X=pd.DataFrame({'rainfall_intensity':rainfall,'rainfall_accumulation':acc,'forecast_rainfall':forecast,'elevation':elevation,'slope':slope,'drain_capacity':drain_cap,'drain_utilization':util,'blockage_percentage':blockage,'catchment_area':catchment,'historical_flood_frequency':hist,'distance_to_drain':dist,'road_elevation':road})
    return X,y,depth


def train():
    X,y,depth=build_dataset()
    Xtr,Xte,ytr,yte,dtr,dte=train_test_split(X,y,depth,test_size=.2,random_state=42,stratify=y)
    clf=RandomForestClassifier(n_estimators=180,max_depth=9,random_state=42,class_weight='balanced_subsample')
    reg=RandomForestRegressor(n_estimators=180,max_depth=10,random_state=42)
    clf.fit(Xtr,ytr); reg.fit(Xtr,dtr)
    pred=clf.predict(Xte); dp=reg.predict(Xte)
    metrics={'accuracy':float(accuracy_score(yte,pred)),'precision':float(precision_score(yte,pred,zero_division=0)),'recall':float(recall_score(yte,pred,zero_division=0)),'f1':float(f1_score(yte,pred,zero_division=0)),'mae':float(mean_absolute_error(dte,dp)),'rmse':float(np.sqrt(mean_squared_error(dte,dp))),'model':'RandomForestClassifier + RandomForestRegressor','version':'1.0.0','trained_at':datetime.now(timezone.utc).isoformat()}
    joblib.dump({'classifier':clf,'regressor':reg,'features':FEATURES},MODEL_PATH)
    METRICS_PATH.write_text(json.dumps(metrics,indent=2))
    return clf,reg,metrics

if MODEL_PATH.exists() and METRICS_PATH.exists():
    saved=joblib.load(MODEL_PATH); clf,reg=saved['classifier'],saved['regressor']; metrics=json.loads(METRICS_PATH.read_text())
else: clf,reg,metrics=train()

app=FastAPI(title='JALRAKSHAK ML Service',version='1.0.0')
class PredictInput(BaseModel):
    rainfall_intensity: float=Field(68,ge=0); rainfall_accumulation: float=20; forecast_rainfall: float=76; elevation: float=212; slope: float=2.8; drain_capacity: float=120; drain_utilization: float=91; blockage_percentage: float=18; catchment_area: float=1.2; historical_flood_frequency: float=8; distance_to_drain: float=.4; road_elevation: float=212

@app.get('/health')
def health(): return {'status':'ok','service':'jalrakshak-ml','model':metrics['version']}
@app.get('/model-metrics')
def model_metrics(): return {'activeModel':{'name':'Random Forest Flood Risk Baseline','version':metrics['version'],'status':'READY'},'metrics':{k:metrics[k] for k in ['accuracy','precision','recall','f1','mae','rmse']},'model':metrics['model'],'trainedAt':metrics['trained_at'],'syntheticData':True}
@app.post('/predict-flood-risk')
def predict(p:PredictInput):
    row=pd.DataFrame([[getattr(p,f) for f in FEATURES]],columns=FEATURES)
    prob=float(clf.predict_proba(row)[0,1]); depth=float(max(0,min(.99,reg.predict(row)[0]))); score=round(prob*100)
    level='CRITICAL' if score>=80 else 'HIGH' if score>=60 else 'MODERATE' if score>=40 else 'LOW'
    imps=clf.feature_importances_; pairs=sorted(zip(FEATURES,imps),key=lambda z:z[1],reverse=True)[:5]; total=sum(v for _,v in pairs) or 1
    reasons=[{'feature':f.replace('_',' ').title(),'contribution':round(float(v/total*100),1)} for f,v in pairs]
    confidence=float(min(.98,max(.6,0.72+abs(prob-.5)*.5)))
    return {'flood_probability':round(prob,4),'risk_level':level,'estimated_water_depth':round(depth,3),'confidence_score':round(confidence,3),'reasons':reasons,'model_version':metrics['version'],'syntheticData':True}
