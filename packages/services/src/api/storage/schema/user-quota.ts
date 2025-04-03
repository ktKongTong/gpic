import {integer,index, sqliteTable, text, } from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";
const commonTimeFields = {
  createdAt: integer('created_at', {mode: 'timestamp_ms'}).default(sql`(unixepoch() * 1000)`).notNull(),
  updatedAt: integer('updated_at', {mode: 'timestamp_ms'}).default(sql`(unixepoch() * 1000)`).notNull().$onUpdateFn(() => new Date())
}

export const styles = sqliteTable("styles", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  prompt: text('prompt').notNull(),
  ...commonTimeFields
}, (table) => [
  index('styles_user_id_idx').on(table.name),
]);


export const examples = sqliteTable("examples", {
  id: text("id").primaryKey(),
  inputUrls: text("input_urls"),
  style: text("style"),
  prompt: text("prompt"),
  description: text("description"),
  url: text('url').notNull(),
  userId: text("user_id"),
  ...commonTimeFields
}, (table) => [
  index('examples_user_id_idx').on(table.userId),
  index('examples_style_idx').on(table.style),
]);

export const credit = sqliteTable("credit", {
  id: text("id").primaryKey(),
  // special one, anonymous
  userId: text("user_id").unique().notNull(),
  balance: text("balance").notNull(),
  ...commonTimeFields
}, (table) => [
  index('credit_user_id_idx').on(table.userId),
]);

export const usage = sqliteTable("usage", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull(),
  cost: integer("cost", {mode: 'number'}).notNull(),
  ...commonTimeFields
}, (table) => [
  index('usage_task_id_idx').on(table.taskId),
]);
