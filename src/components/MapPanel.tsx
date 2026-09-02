import {useState} from 'react';
import {MapContainer,TileLayer,CircleMarker,Popup,useMap} from 'react-leaflet';
import {Circle,Layers3,LocateFixed,Minus,Plus,ShieldAlert} from 'lucide-react';
import {areas,waterBodies,shelters,infrastructure} from '../data/mock';

type LayerKey='risk'|'water'|'shelters'|'infra';
export default function MapPanel(){
 const [layers,setLayers]=useState<Record<LayerKey,boolean>>({risk:true,water:true,shelters:true,infra:true});
 const [zoom,setZoom]=useState(13);
 const toggle=(key:LayerKey)=>setLayers(v=>({...v,[key]:!v[key]}));
 return <div className="map-wrap">
  <MapContainer center={[26.805,82.195]} zoom={zoom} scrollWheelZoom={true} zoomControl={false}>
   <MapController zoom={zoom}/><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
   {layers.risk&&areas.map(a=><CircleMarker key={a.id} center={[a.lat,a.lng]} radius={a.risk>75?17:a.risk>50?13:10} pathOptions={{className:`risk-${a.status.toLowerCase()}`,fillOpacity:.72,weight:2}}>
    <Popup><b>{a.name}</b><br/>Risk score: {a.risk}/100<br/>Predicted depth: {a.depth.toFixed(2)} m<br/>Drain utilization: {a.drain}%</Popup>
   </CircleMarker>)}
   {layers.water&&waterBodies.map(w=><CircleMarker key={w.id} center={[w.lat,w.lng]} radius={11} pathOptions={{color:'#4ba9d1',fillColor:'#4ba9d1',fillOpacity:.45,weight:1.5,dashArray:'4 3'}}>
    <Popup><b>Water body · {w.name}</b><br/>Storage level: {w.level}%<br/>Status: {w.status}</Popup>
   </CircleMarker>)}
   {layers.shelters&&shelters.map(s=><CircleMarker key={s.id} center={[s.lat,s.lng]} radius={7} pathOptions={{color:'#4bd18a',fillColor:'#4bd18a',fillOpacity:.9,weight:2}}>
    <Popup><b>Relief shelter · {s.name}</b><br/>Capacity: {s.capacity}<br/>Occupied: {s.occupied}</Popup>
   </CircleMarker>)}
   {layers.infra&&infrastructure.map(i=><CircleMarker key={i.id} center={[i.lat,i.lng]} radius={7} pathOptions={{color:'#d9e5ef',fillColor:'#15293b',fillOpacity:1,weight:2}}>
    <Popup><b>{i.type} · {i.name}</b><br/>Status: {i.status}</Popup>
   </CircleMarker>)}
  </MapContainer>
  <div className="map-toolbar">
   <button onClick={()=>setZoom(z=>Math.min(17,z+1))} aria-label="Zoom in"><Plus size={15}/></button>
   <button onClick={()=>setZoom(z=>Math.max(10,z-1))} aria-label="Zoom out"><Minus size={15}/></button>
   <button onClick={()=>setZoom(13)} aria-label="Reset view"><LocateFixed size={15}/></button>
  </div>
  <div className="layer-panel"><div className="layer-title"><Layers3 size={13}/>MAP LAYERS</div>
   <LayerButton label="Flood risk" active={layers.risk} tone="risk" onClick={()=>toggle('risk')}/><LayerButton label="Water bodies" active={layers.water} tone="water" onClick={()=>toggle('water')}/><LayerButton label="Shelters" active={layers.shelters} tone="shelter" onClick={()=>toggle('shelters')}/><LayerButton label="Critical infrastructure" active={layers.infra} tone="infra" onClick={()=>toggle('infra')}/>
  </div>
  <div className="map-legend"><b>FLOOD RISK</b><span><i className="critical"></i>Critical</span><span><i className="high"></i>High</span><span><i className="moderate"></i>Moderate</span><span><i className="low"></i>Low</span></div>
  <div className="map-tag"><ShieldAlert size={12}/> +2H FORECAST</div>
 </div>
}
function MapController({zoom}:{zoom:number}){const map=useMap(); map.setZoom(zoom); return null}
function LayerButton({label,active,tone,onClick}:{label:string;active:boolean;tone:string;onClick:()=>void}){return <button className={`layer-btn ${active?'active':''}`} onClick={onClick}><span className={`layer-dot ${tone}`}></span>{label}<span className="layer-state">{active?'ON':'OFF'}</span></button>}
