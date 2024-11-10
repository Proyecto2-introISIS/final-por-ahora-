
//import { defineConfig } from 'drizzle-kit';

export default {
    schema: "./utils/schema.jsx", // Path to your schema
    dialect: "postgresql", // Use "dialect" for PostgreSQL
    dbCredentials: {
        url: "postgresql://budget_owner:J4qrIbATd5zK@ep-lively-glitter-a5jml6z3.us-east-2.aws.neon.tech/Expenses-tracker?sslmode=require", 
    }
}
