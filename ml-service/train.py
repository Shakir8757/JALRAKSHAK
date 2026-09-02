from pathlib import Path
import json, numpy as np, pandas as pd, joblib
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score,precision_score,recall_score,f1_score,mean_absolute_error,mean_squared_error
BASE=Path(__file__).resolve().parent; DATA=BASE/'data'/'synthetic_flood_training.csv'; ART=BASE/'artifacts'; ART.mkdir(exist_ok=True)
FEATURES=['rainfall_intensity','rainfall_accumulation','forecast_rainfall','elevation','slope','drain_capacity','drain_utilization','blockage_percentage','catchment_area','historical_flood_frequency','distance_to_drain','road_elevation']
df=pd.read_csv(DATA); X=df[FEATURES]; y=df['flooded'].astype(int); depth=df['water_depth'].astype(float)
Xtr,Xte,ytr,yte,dtr,dte=train_test_split(X,y,depth,test_size=.2,random_state=42,stratify=y)
clf=RandomForestClassifier(n_estimators=180,max_depth=9,random_state=42,class_weight='balanced_subsample'); reg=RandomForestRegressor(n_estimators=180,max_depth=10,random_state=42)
clf.fit(Xtr,ytr); reg.fit(Xtr,dtr); yp=clf.predict(Xte); dp=reg.predict(Xte)
metrics={'accuracy':float(accuracy_score(yte,yp)),'precision':float(precision_score(yte,yp,zero_division=0)),'recall':float(recall_score(yte,yp,zero_division=0)),'f1':float(f1_score(yte,yp,zero_division=0)),'mae':float(mean_absolute_error(dte,dp)),'rmse':float(np.sqrt(mean_squared_error(dte,dp))),'model':'RandomForestClassifier + RandomForestRegressor','version':'1.0.0'}
joblib.dump({'classifier':clf,'regressor':reg,'features':FEATURES},ART/'flood_models.joblib'); (ART/'metrics.json').write_text(json.dumps(metrics,indent=2)); print(metrics)
