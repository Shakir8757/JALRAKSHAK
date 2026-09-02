import {areas,alerts,drains} from '../data/mock';
const BASE=import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const MOCK=String(import.meta.env.VITE_USE_MOCK_FALLBACK ?? 'true')==='true';
async function request<T>(path:string,options?:RequestInit):Promise<T>{
 try{const r=await fetch(`${BASE}${path}`,{headers:{'Content-Type':'application/json',...(options?.headers||{})},...options}); if(!r.ok) throw new Error(`API ${r.status}`); return r.json();}
 catch(e){if(!MOCK) throw e; return mock(path) as T;}
}
function mock(path:string){ if(path.startsWith('/dashboard')) return {kpis:{critical:1,high:2,watch:1,roads:3},updatedAt:new Date().toISOString()}; if(path.startsWith('/geo')) return {areas}; if(path.startsWith('/drainage')) return {nodes:drains}; if(path.startsWith('/alerts')) return {alerts}; if(path.startsWith('/models')) return {metrics:{accuracy:.91,precision:.88,recall:.86,f1:.87,mae:.11,rmse:.16},run:'baseline-xgb-v1'}; if(path.startsWith('/history')) return {series:[{month:'Apr',events:4},{month:'May',events:7},{month:'Jun',events:5},{month:'Jul',events:9},{month:'Aug',events:6}]}; return {} }
export const api={getDashboard:()=>request<any>('/dashboard'),getGeo:()=>request<any>('/geo/risk'),getDrainage:()=>request<any>('/drainage'),getAlerts:()=>request<any>('/alerts'),getModels:()=>request<any>('/models'),getHistory:()=>request<any>('/history'),predict:(body:any)=>request<any>('/predictions',{method:'POST',body:JSON.stringify(body)}),simulate:(body:any)=>request<any>('/simulation',{method:'POST',body:JSON.stringify(body)}),route:(body:any)=>request<any>('/routes',{method:'POST',body:JSON.stringify(body)}),chat:(body:any)=>request<any>('/chat/query',{method:'POST',body:JSON.stringify(body)})};
