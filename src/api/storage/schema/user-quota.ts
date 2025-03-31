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

// taskId.
// create taskId.
// queue a task, stream.
//
export const history = sqliteTable("task_history", {
  id: text("id").primaryKey(),
  taskId: text("task_id").notNull(),
  usage: integer('credit_usage', {mode: 'number'}).notNull(),
  // modified input.
  input: text('output', {mode: 'json'}).notNull(),
  output: text('output', {mode: 'json'}),
  // failed, success
  status: text('status', {mode: 'text'}).notNull(),
  ...commonTimeFields
}, (table) => [
  index('task_history_user_id_idx').on(table.taskId),
  index('task_history_status_idx').on(table.status),
]);

export const task = sqliteTable("task", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  input: text('input', {mode: 'json'}).notNull(),
  retry: integer('retry', {mode: 'number'}).notNull(),
  // gen-image
  type: text('type').notNull(),
  // not_start, drawing, failed => drawing, success.
  status: text('status', {mode: 'text'}).notNull(),
  // share, public, private, share input. share output.
  metadata: text('metadata', {mode: 'json'}).notNull(),
  ...commonTimeFields
}, (table) => [
  index('task_user_id_idx').on(table.userId),
  index('task_status_idx').on(table.status),
]);
// gallery
const abc = sqliteTable("gallery", {
  id: text("id").primaryKey(),


  // {string}
  input: text('input', {mode: 'json'}).notNull(),
  output: text('output', {mode: 'json'}),
  success: integer('success', {mode: 'boolean'}).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// history
// gallery
// source,