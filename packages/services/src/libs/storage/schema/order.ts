import {index, integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import { commonTimeFields } from "./common";

export const credit = sqliteTable("credit", {
  userId: text("user_id").primaryKey(),
  balance: integer("balance").notNull(),
  ...commonTimeFields
}, (table) => [
]);

export const order = sqliteTable("order", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  taskId: text("task_id"),
  type: text("type", {enum: ['task', 'credit-add']}),
  count: integer("count", {mode: 'number'}).notNull(),
  msg: text("msg"),
  ...commonTimeFields
}, (table) => [
  index('usage_task_id_idx').on(table.taskId),
  index('usage_user_id_idx').on(table.userId),
]);
