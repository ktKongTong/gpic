import {index, integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import { commonTimeFields } from "./common";

export const credit = sqliteTable("credit", {
  userId: text("user_id").primaryKey(),
  balance: integer("balance").notNull(),
  ...commonTimeFields
}, (table) => [
]);

export const usage = sqliteTable("usage", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  taskId: text("task_id").notNull(),
  cost: integer("cost", {mode: 'number'}).notNull(),
  ...commonTimeFields
}, (table) => [
  index('usage_task_id_idx').on(table.taskId),
  index('usage_user_id_idx').on(table.userId),
]);
