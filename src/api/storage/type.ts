import {DrizzleD1Database} from "drizzle-orm/d1";
import * as schema from "./schema";
import {getDAO} from "./db";

export type DB = DrizzleD1Database<typeof schema>
export type DAO = ReturnType<typeof getDAO>