import {integer, index, sqliteTable, text, uniqueIndex,} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";
const commonTimeFields = {
  createdAt: integer('created_at', {mode: 'timestamp_ms'}).default(sql`(unixepoch() * 1000)`).notNull(),
  updatedAt: integer('updated_at', {mode: 'timestamp_ms'}).default(sql`(unixepoch() * 1000)`).notNull().$onUpdateFn(() => new Date())
}

export const i18nCode = { ZH: 'zh-CN', EN: 'en-US', JP: 'ja-JP', KR: 'ko-KR' } as const

const i18nCodeArr = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'] as const

export const style = sqliteTable("style", {
  id: text("id").primaryKey(),
  styleId: text("style_friendly_id").notNull(),
  version: integer("prompt_version").notNull().$defaultFn(() => 1),
  type: text('type', { enum: ['system', 'user'] }).notNull(),
  reference: text('reference', {mode: 'json'}).notNull().$defaultFn(() => []),
  prompt: text('prompt').notNull(),
  ...commonTimeFields
}, (table) => [
  index('style_friendly_id_idx').on(table.styleId),
]);

export const styleI18n = sqliteTable("style_i18n", {
  id: text("id").primaryKey(),
  styleId: text("style_friendly_id").notNull(),
  i18n: text("i18n", {enum: i18nCodeArr }).notNull(),
  name: text('name').notNull(),
  type: text('type', { enum: ['system', 'user'] }).notNull(),
  aliases: text('aliases', {mode: 'json'}).notNull().$defaultFn(() => []),
  description: text('description'),
  ...commonTimeFields
}, (table) => [
  uniqueIndex('style_i18n_idx').on(table.styleId, table.i18n),
]);

export const credit = sqliteTable("credit", {
  id: text("id").primaryKey(),
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
