import {integer,index, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

const commonTimeFields = {
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull().$onUpdateFn(() => sql`CURRENT_TIMESTAMP`)
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
  userId: text("user_id").notNull(),
  balance: text("balance").notNull(),
  ...commonTimeFields
}, (table) => [
  index('credit_user_id_idx').on(table.userId),
]);

const executionStatus = ['success', 'failed', 'processing'] as const

export const history = sqliteTable("task_history", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull(),
  usage: integer('credit_usage', {mode: 'number'}).notNull(),
  input: text('input', {mode: 'json'}).notNull(),
  output: text('output', {mode: 'json'}),
  // current state
  state: text('state', {mode: 'json'}),
  status: text('status', {mode: 'text', enum: executionStatus}).notNull(),
  ...commonTimeFields
}, (table) => [
  index('task_history_user_id_idx').on(table.taskId),
  index('task_history_status_idx').on(table.status),
]);


const taskStatus = ['waiting','processing', 'success', 'failed'] as const
const taskType = ['image-gen', 'batch', ] as const
export const task = sqliteTable("task", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  input: text('input', {mode: 'json'}).notNull(),
  type: text('type', { enum: taskType }).notNull(),
  retry: integer('retry', {mode: 'number'}).default(0).notNull(),
  status: text('status', {mode: 'text', enum: taskStatus}).notNull(),
  metadata: text('metadata', {mode: 'json'}).notNull(),
  ...commonTimeFields
}, (table) => [
  index('task_user_id_idx').on(table.userId),
  index('task_status_idx').on(table.status),
]);

// history
// gallery
// source,