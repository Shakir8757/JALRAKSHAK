export const areas=[
 {id:'riverfront',name:'Riverfront Ward',risk:86,depth:0.74,rain:68,drain:91,lat:26.80,lng:82.20,status:'Critical'},
 {id:'central',name:'Central Market',risk:71,depth:0.42,rain:54,drain:76,lat:26.81,lng:82.19,status:'High'},
 {id:'east',name:'East Industrial',risk:63,depth:0.31,rain:49,drain:69,lat:26.79,lng:82.22,status:'High'},
 {id:'north',name:'North Residential',risk:39,depth:0.15,rain:36,drain:42,lat:26.83,lng:82.20,status:'Moderate'},
 {id:'west',name:'West Bypass',risk:24,depth:0.08,rain:28,drain:31,lat:26.80,lng:82.16,status:'Low'}
];
export const drains=[{name:'D-17 Canal Gate',load:91,status:'Overloaded'},{name:'D-08 Market Trunk',load:76,status:'High load'},{name:'D-22 East Collector',load:69,status:'High load'},{name:'D-03 North Link',load:42,status:'Normal'}];
export const alerts=[
 {level:'CRITICAL',title:'Riverfront Ward crossing threshold',time:'2 min ago',detail:'Predicted depth 0.74 m at +2h. Emergency response recommended.'},
 {level:'HIGH',title:'D-17 drainage capacity constrained',time:'8 min ago',detail:'Utilization reached 91% with continuing rainfall.'},
 {level:'WATCH',title:'East Industrial accumulation rising',time:'21 min ago',detail:'Model projects moderate-to-high risk within 90 minutes.'}
];

export const waterBodies=[
 {id:'pond-1',name:'Riverfront Retention Basin',lat:26.802,lng:82.207,level:82,status:'High'},
 {id:'pond-2',name:'North Stormwater Pond',lat:26.825,lng:82.194,level:48,status:'Normal'},
 {id:'pond-3',name:'East Industrial Lake',lat:26.792,lng:82.226,level:71,status:'Watch'}
];
export const shelters=[
 {id:'s-1',name:'Central Community Shelter',lat:26.812,lng:82.185,capacity:240,occupied:118},
 {id:'s-2',name:'North Relief Centre',lat:26.835,lng:82.205,capacity:180,occupied:64},
 {id:'s-3',name:'West Sports Complex Shelter',lat:26.798,lng:82.151,capacity:320,occupied:92}
];
export const infrastructure=[
 {id:'h-1',name:'District Hospital',type:'Hospital',lat:26.816,lng:82.203,status:'Operational'},
 {id:'f-1',name:'Central Fire Station',type:'Fire Station',lat:26.806,lng:82.178,status:'Operational'},
 {id:'p-1',name:'Police Control Point',type:'Police',lat:26.821,lng:82.214,status:'Operational'}
];
