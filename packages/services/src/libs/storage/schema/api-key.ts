


import {index, integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {commonTimeFields} from "./common";
import {user} from "./auth-schema";

export const apiKey = sqliteTable("apikey", {
  id: text("id").primaryKey(),
  name: text('name'),
  start: text('start'),
  prefix: text('prefix'),
  key: text('key').notNull(),
  userId: text('user_id').notNull().references(() => user.id),
  refillInterval: integer('refill_internal'),
  refillAmount: integer('refill_amount'),
  lastRefillAt: integer('last_refill_at', {mode: 'timestamp_ms'}),
  enabled: integer('enabled', {mode: 'boolean'}).notNull(),
  rateLimitEnabled: integer('rate_limit_enabled', {mode: 'boolean'}).notNull(),
  rateLimitTimeWindow: integer('rate_limit_time_window'),
  rateLimitMax: integer('rate_limit_max'),
  requestCount: integer('request_count').notNull(),
  remain: integer('remain'),
  lastRequest: integer('last_request', {mode: 'timestamp_ms'}),
  expiresAt: integer('expires_at', {mode: 'timestamp_ms'}),
  permissions: text('permissions'),
  metadata: text('metadata', {mode: 'json'}),
  ...commonTimeFields,
}, (table) => [
  index('apikey_key_index').on(table.key),
  index('apikey_prefix_key_index').on(table.prefix, table.key),
  index('apikey_user_id_index').on(table.userId),
]);