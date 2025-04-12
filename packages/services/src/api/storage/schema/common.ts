import {integer} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

export const commonTimeFields = {
  createdAt: integer('created_at', {mode: 'timestamp_ms'}).default(sql`(unixepoch() * 1000)`).notNull(),
  updatedAt: integer('updated_at', {mode: 'timestamp_ms'}).default(sql`(unixepoch() * 1000)`).notNull().$onUpdateFn(() => new Date())
}
