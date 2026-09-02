import 'dotenv/config';
import { z } from 'zod';
const schema=z.object({PORT:z.coerce.number().default(4000),NODE_ENV:z.string().default('development'),FRONTEND_ORIGIN:z.string().default('http://localhost:5173'),JWT_SECRET:z.string().min(8).default('change-this-in-development'),JWT_EXPIRES_IN:z.string().default('2h'),DATABASE_URL:z.string().optional(),ML_SERVICE_URL:z.string().default('http://localhost:8000'),MAP_SERVICE_URL:z.string().default('http://localhost:4100'),USE_SYNTHETIC_DATA:z.coerce.boolean().default(true)});
export const env=schema.parse(process.env);
