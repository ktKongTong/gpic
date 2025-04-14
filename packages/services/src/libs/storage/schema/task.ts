import {index, integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {getRandomName} from "../../../utils/random";
import {commonTimeFields} from "./common";
import {executionStatusArr, taskStatusArr, taskTypeArr, Versioned} from "../../../shared";



export const execution = sqliteTable("task_history", {
  id: text("id").primaryKey(),
  name: text('name').notNull().$defaultFn(() => getRandomName()),
  taskId: text("task_id").notNull(),
  usage: integer('credit_usage', {mode: 'number'}).notNull().$defaultFn(() => 0),
  input: text('input', {mode: 'json'}).$type<Versioned>().notNull(),
  output: text('output', {mode: 'json'}).$type<Versioned>(),
  state: text('state', {mode: 'json'}).$type<Versioned>(),
  status: text('status', {mode: 'text', enum: executionStatusArr}).notNull(),
  startedAt: integer('started_at', {mode: 'timestamp_ms'}),
  endedAt: integer('ended_at', {mode: 'timestamp_ms'}),
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
  input: text('input', {mode: 'json'}).$type<Versioned>().notNull(),
  metadata: text('metadata', {mode: 'json'}).$type<Versioned>().notNull(),
  type: text('type', { enum: taskTypeArr }).notNull(),
  retry: integer('retry', {mode: 'number'}).default(0).notNull(),
  status: text('status', {mode: 'text', enum: taskStatusArr}).notNull(),
  startedAt: integer('started_at', {mode: 'timestamp_ms'}),
  endedAt: integer('ended_at', {mode: 'timestamp_ms'}),
  ...commonTimeFields
}, (table) => [
  index('task_user_id_idx').on(table.userId),
  index('task_status_idx').on(table.status),
]);
