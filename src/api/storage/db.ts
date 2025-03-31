import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";
import {QuotaDAO} from "@/api/storage/dao/quota";
import {HistoryDAO} from "@/api/storage/dao/gallery";
import {TaskDAO} from "@/api/storage/dao/task";

export let db: DrizzleD1Database<typeof schema> | null = null;

export const getDB = () => {
  if (db) {
    return db;
  }

  const { env } = getCloudflareContext();
  // @ts-ignore
  if (!env?.DB) {
    throw new Error("D1 database not found");
  }
  // @ts-ignore
  db = drizzle(env.DB, { schema, logger: true });

  return db;
};

export const getDAO = () => {
  const db = getDB()
  return {
    quota: new QuotaDAO(db),
    history: new HistoryDAO(db),
    task: new TaskDAO(db)
  }
}