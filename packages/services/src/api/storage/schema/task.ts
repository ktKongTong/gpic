import {index, integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";
import {getRandomName} from "../../utils/random";

const commonTimeFields = {
  createdAt: integer('created_at', {mode: 'timestamp_ms'}).default(sql`(unixepoch() * 1000)`).notNull(),
  updatedAt: integer('updated_at', {mode: 'timestamp_ms'}).default(sql`(unixepoch() * 1000)`).notNull().$onUpdateFn(() => new Date())
}

const executionStatus = ['completed', 'failed', 'processing'] as const
const taskStatus = ['pending','processing', 'completed', 'failed'] as const
const taskType = ['image-gen', 'batch', ] as const

export const history = sqliteTable("task_history", {
  id: text("id").primaryKey(),
  name: text('name').notNull().$defaultFn(() => getRandomName()),
  taskId: text("task_id").notNull(),
  usage: integer('credit_usage', {mode: 'number'}).notNull(),
  input: text('input', {mode: 'json'}).notNull(),
  output: text('output', {mode: 'json'}),
  state: text('state', {mode: 'json'}),
  status: text('status', {mode: 'text', enum: executionStatus}).notNull(),
  ...commonTimeFields
}, (table) => [
  index('task_history_user_id_idx').on(table.taskId),
  index('task_history_status_idx').on(table.status),
]);


export const task = sqliteTable("task", {
  id: text("id").primaryKey(),
  parentId: text("parent_id"),
  name: text('name').notNull().$defaultFn(() => getRandomName()),
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