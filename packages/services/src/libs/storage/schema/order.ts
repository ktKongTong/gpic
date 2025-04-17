import {index, integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import { commonTimeFields } from "./common";

export const credit = sqliteTable("credit", {
  userId: text("user_id").primaryKey(),
  balance: integer("balance").notNull(),
  ...commonTimeFields
}, (table) => [
]);

export const exchangeCoupon = sqliteTable('exchange_coupon', {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  code: text('code').notNull(),
  amount: integer("amount", {mode: 'number'}).notNull(),
  msg: text("msg"),
  ...commonTimeFields
}, (table) => [
  index('exchange_user_id_idx').on(table.userId),
  index('exchange_code_idx').on(table.code),
])

export const order = sqliteTable("order", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  taskId: text("task_id"),
  type: text("type", {enum: ['task', 'credit-add']}).notNull(),
  amount: integer("amount", {mode: 'number'}).notNull(),
  msg: text("msg"),
  ...commonTimeFields
}, (table) => [
  index('usage_task_id_idx').on(table.taskId),
  index('usage_user_id_idx').on(table.userId),
]);
