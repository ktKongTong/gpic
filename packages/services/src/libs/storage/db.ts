import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from "./schema";
import {BalanceDAO} from "./dao/quota";
import {HistoryDAO} from "./dao/execution";
import {TaskDAO} from "./dao/task";
import {StyleDAO} from './dao/style'
import {getCloudflareEnv} from "../../utils";

export let db: DrizzleD1Database<typeof schema> | null = null;

export const getDB = (env?: CloudflareEnv) => {
  if (db) {
    return db;
  }
  let _env = env
  if(!_env) {
    _env = getCloudflareEnv()
  }
  // @ts-ignore
  if (!_env?.DB) {
    throw new Error("D1 database not found");
  }
  // @ts-ignore
  db = drizzle(_env.DB, { schema, logger: true });

  return db;
};

export const getDAO = (env?: CloudflareEnv) => {
  const db = getDB(env)
  return {
    balance: new BalanceDAO(db),
    style: new StyleDAO(db),
    history: new HistoryDAO(db),
    task: new TaskDAO(db)
  }
}