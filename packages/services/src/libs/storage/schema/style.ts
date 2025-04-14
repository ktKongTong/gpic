import {integer, index, sqliteTable, text, uniqueIndex,} from "drizzle-orm/sqlite-core";
import {commonTimeFields} from "./common";
import {i18nCodeArr} from "../../../shared";

export const style = sqliteTable("style", {
  id: text("id").primaryKey(),
  styleId: text("style_friendly_id").notNull(),
  version: integer("prompt_version").notNull().$defaultFn(() => 1),
  type: text('type', { enum: ['system', 'user'] }).notNull(),
  reference: text('reference', {mode: 'json'}).$type<string[]>().notNull().$defaultFn(() => []),
  prompt: text('prompt').notNull(),
  ...commonTimeFields
}, (table) => [
  index('style_friendly_id_idx').on(table.styleId),
]);

export const styleI18n = sqliteTable("style_i18n", {
  id: text("id").primaryKey(),
  styleId: text("style_friendly_id").notNull().references(() => style.styleId, {onUpdate: 'cascade', onDelete: 'cascade'}),
  i18n: text("i18n", {enum: i18nCodeArr }).notNull(),
  name: text('name').notNull(),
  aliases: text('aliases', {mode: 'json'}).$type<string[]>().notNull().$defaultFn(() => []),
  description: text('description'),
  ...commonTimeFields
}, (table) => [
  uniqueIndex('style_i18n_idx').on(table.styleId, table.i18n),
]);