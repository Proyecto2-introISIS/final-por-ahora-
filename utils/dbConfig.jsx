import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema"
const sql = neon("postgresql://budget_owner:J4qrIbATd5zK@ep-lively-glitter-a5jml6z3.us-east-2.aws.neon.tech/Expenses-tracker?sslmode=require");

export const db =drizzle(sql,{schema});