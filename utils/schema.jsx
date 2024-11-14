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
    id: serial("id").primaryKey(), // Identificador único de cada factura
    name: varchar("name", { length: 255 }).notNull(), // Nombre de la factura
    image_url: text("image_url").notNull(), // URL o base64 de la imagen
    user_id: text("user_id").notNull(), // Cambiado a varchar para el ID de usuario
    amount: numeric("amount"),
    budget_source: varchar("budget_source"),
    uploaded_at: timestamp("uploaded_at").defaultNow().notNull() // Fecha de carga
});
