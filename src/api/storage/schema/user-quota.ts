import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

export const styles = sqliteTable("styles", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  prompt: text('value').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});


export const examples = sqliteTable("examples", {
  id: text("id").primaryKey(),
  styleId: text("style_id").notNull(),
  url: text('url').notNull(),
  userId: text("user_id"),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});



export const quota = sqliteTable("quota", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  // credit, must be positive
  balance: text("balance").notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});


export const history = sqliteTable("history", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  sessionInfo: text("session_info", {mode: 'json'}),
  usage: integer('credit_usage', {mode: 'number'}).notNull(),
  // original-image-url
  // urls: string
  // description,
  // styles,
  // prompt
  input: text('input', {mode: 'json'}).notNull(),
  output: text('output', {mode: 'json'}),
  success: integer('success', {mode: 'boolean'}).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});