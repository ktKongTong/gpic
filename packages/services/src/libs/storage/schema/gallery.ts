import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import {commonTimeFields} from "./common";

export const gallery = sqliteTable("gallery", {
  id: text("id").primaryKey(),
  description: text('description'),
  url: text("url").notNull(),
  originUrl: text('origin_url'),
  styleId: text('style_id'),
  input: text('input', {mode: 'json'}),
  taskId: text('task_id'),
  ...commonTimeFields
}, (table) => [

]);
