import {sqliteTable, text, integer, index} from "drizzle-orm/sqlite-core";
import {commonTimeFields} from "./common";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', {mode: 'boolean'}).notNull(),
  image: text('image'),
  ...commonTimeFields,
}, (table) => [
  index('user_email_idx').on(table.email),
]);

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer('expires_at', {mode: 'timestamp_ms'}).notNull(),
  token: text('token').notNull().unique(),
  ...commonTimeFields,
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' })
}, (table) => [
  index('session_user_id_idx').on(table.userId),
  index('session_token_idx').on(table.token),
]);

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {mode: 'timestamp_ms'}),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {mode: 'timestamp_ms'}),
  scope: text('scope'),
  password: text('password'),
  ...commonTimeFields,
}, (table) => [
  index('account_account_id_idx').on(table.accountId),
  index('account_user_id_idx').on(table.userId),
]);

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', {mode: 'timestamp_ms'}).notNull(),
  ...commonTimeFields,
});

