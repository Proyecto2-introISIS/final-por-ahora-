//import { serial, varchar } from "drizzle-orm/mysql-core";
import { integer, pgTable, serial, varchar, timestamp, text, numeric } from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
    id: serial("id").primaryKey(), // Changed from primary.Key() to primaryKey()
    name: varchar("name").notNull(),
    amount: varchar("amount").notNull(),
    icon: varchar("icon"),
    createdBy: varchar("createdBy").notNull(),
});

export const Expenses=pgTable("expenses",{
    id:serial("id").primaryKey(),
    name:varchar("name").notNull(),
    amount:varchar("amount").notNull(),
    budgetId: integer("budgetId").references(()=>Budgets.id),
    createdAt:varchar("createdAt").notNull()

});


export const Receipts = pgTable("receipts", {
    id: serial("id").primaryKey(), 
    name: varchar("name", { length: 255 }).notNull(), 
    image_url: text("image_url").notNull(), 
    user_id: text("user_id").notNull(), 
    amount: numeric("amount"),
    budget_source: varchar("budget_source"),
    uploaded_at: timestamp("uploaded_at").defaultNow().notNull() 
});
