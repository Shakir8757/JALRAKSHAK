import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { Request,Response,NextFunction } from 'express';
export type Role='ADMIN'|'AUTHORITY'|'OPERATOR'|'VIEWER';
export type AuthUser={id:string,email:string,role:Role};
declare global { namespace Express { interface Request { user?: AuthUser } } }
export function signToken(user:AuthUser){return jwt.sign(user,env.JWT_SECRET,{expiresIn:env.JWT_EXPIRES_IN as any});}
export function requireAuth(req:Request,res:Response,next:NextFunction){const h=req.headers.authorization;if(!h?.startsWith('Bearer '))return res.status(401).json({error:'Authentication required'});try{req.user=jwt.verify(h.slice(7),env.JWT_SECRET) as AuthUser;next();}catch{return res.status(401).json({error:'Invalid or expired token'});}}
export function requireRole(...roles:Role[]){return (req:Request,res:Response,next:NextFunction)=>{if(!req.user)return res.status(401).json({error:'Authentication required'});if(!roles.includes(req.user.role))return res.status(403).json({error:'Insufficient permissions'});next();};}
