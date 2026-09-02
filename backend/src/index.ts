import express from 'express'; import cors from 'cors'; import rateLimit from 'express-rate-limit'; import {env} from './config/env.js'; import api from './routes/api.js'; import {notFound,errorHandler} from './middleware/error.js';
const app=express(); app.disable('x-powered-by');
const allowed=env.FRONTEND_ORIGIN.split(',').map(x=>x.trim()).filter(Boolean);
app.use(cors({origin:(origin,cb)=>{if(!origin||allowed.includes('*')||allowed.includes(origin))return cb(null,true);return cb(new Error('CORS blocked'))},credentials:true}));
app.use(express.json({limit:'1mb'})); app.use(rateLimit({windowMs:60_000,max:120,standardHeaders:true,legacyHeaders:false})); app.use('/api',api); app.use(notFound); app.use(errorHandler);
app.listen(env.PORT,'0.0.0.0',()=>console.log(`JALRAKSHAK backend running on ${env.PORT}`));
