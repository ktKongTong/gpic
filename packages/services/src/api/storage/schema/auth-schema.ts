import {sqliteTable, text, integer, index} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', {mode: 'boolean'}).notNull(),
  image: text('image'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('user_email_idx').on(table.email),
]);

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: text('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
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
  accessTokenExpiresAt: text('access_token_expires_at'),
  refreshTokenExpiresAt: text('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  index('account_account_id_idx').on(table.accountId),
  index('account_user_id_idx').on(table.userId),
]);

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});
