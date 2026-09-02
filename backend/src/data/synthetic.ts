export const areas=[
 {id:'zone-01',name:'Riverside Ward',lat:28.6139,lng:77.2090,risk:86,level:'CRITICAL',depth:0.74,elevation:212,rainfall:68,drainUtilization:91,blockage:18},
 {id:'zone-02',name:'Central Market',lat:28.6219,lng:77.2180,risk:72,level:'HIGH',depth:0.48,elevation:218,rainfall:61,drainUtilization:82,blockage:12},
 {id:'zone-03',name:'North Junction',lat:28.6329,lng:77.2110,risk:63,level:'HIGH',depth:0.31,elevation:224,rainfall:55,drainUtilization:76,blockage:9},
 {id:'zone-04',name:'East Industrial',lat:28.6079,lng:77.2280,risk:48,level:'MODERATE',depth:0.18,elevation:230,rainfall:49,drainUtilization:62,blockage:15}
];
export const drains=[
 {id:'dr-01',name:'Riverside Main',utilization:91,capacity:120,status:'OVERLOADED'},
 {id:'dr-02',name:'Market Collector',utilization:82,capacity:95,status:'HIGH'},
 {id:'dr-03',name:'North Trunk',utilization:76,capacity:140,status:'HIGH'},
 {id:'dr-04',name:'East Channel',utilization:62,capacity:110,status:'NORMAL'}
];
export const waterBodies=[
 {id:'wb-01',name:'Central Lake',type:'lake',levelPct:78,inflowRate:14,overflowRisk:'HIGH',lat:28.616,lng:77.214},
 {id:'wb-02',name:'East Canal',type:'canal',levelPct:61,inflowRate:9,overflowRisk:'MODERATE',lat:28.609,lng:77.224}
];
export const shelters=[
 {id:'sh-01',name:'Civic Relief Centre',lat:28.618,lng:77.205,capacity:420,available:286},
 {id:'sh-02',name:'North Community Hall',lat:28.635,lng:77.215,capacity:250,available:173}
];
export const infrastructure=[
 {id:'inf-01',name:'City General Hospital',type:'hospital',lat:28.611,lng:77.220,status:'OPEN'},
 {id:'inf-02',name:'Central Fire Station',type:'fire_station',lat:28.624,lng:77.207,status:'READY'},
 {id:'inf-03',name:'District Police HQ',type:'police',lat:28.629,lng:77.224,status:'OPERATIONAL'}
];
export const alerts=[
 {id:'al-01',severity:'CRITICAL',title:'Riverside Ward flood risk critical',message:'Predicted depth may reach 0.74 m within 2 hours.',area:'Riverside Ward',createdAt:new Date().toISOString(),status:'ACTIVE'},
 {id:'al-02',severity:'HIGH',title:'Riverside Main drain overloaded',message:'Drain utilization is above 90%.',area:'Riverside Ward',createdAt:new Date().toISOString(),status:'ACTIVE'}
];
