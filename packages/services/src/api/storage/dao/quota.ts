import {DB} from "../type";
import * as table from '../schema'
import {and, eq, getTableColumns, gte, sql} from "drizzle-orm";
import {typeid} from "typeid-js";
import {DBError} from "../../errors";
import {user} from "../schema";
export class BalanceDAO {

  constructor(private readonly db: DB) {
  }

  async getBalanceByUserId(userId: string) {
    const [res] = await this.db.select()
      .from(table.credit)
      .where(eq(table.credit.userId, userId))
    return res
  }

  // todo transaction
  async createTaskOrder(userId: string, taskId: string, cost: number) {
    const id =typeid('cost').toString()

    const [ok] = await this.db.update(table.credit)
      .set({
        balance: sql`${table.credit.balance}-${cost}`,
      })
      .where(and(eq(table.credit.userId, userId), gte(sql`${table.credit.balance}-${cost}`, 0)))
      .returning()
    if(ok) {
      throw new DBError('balance not enough')
    }
    const [res] = await this.db.insert(table.usage).values({
      id,
      userId,
      taskId,
      cost,
    }).returning()
    return res
  }

  async getOrdersByUserId(userId: string) {
    const {userId:uidColumn, ...rest} = getTableColumns(table.usage)
    const res = await this.db.select({
      user: table.user,
      ...rest,
    }).from(table.usage)
    .leftJoin(table.user, eq(table.user.id, table.usage.userId))
    .leftJoin(table.task, eq(table.usage.taskId, table.task.id))
    .where(eq(table.usage.userId, userId))
    return res
  }

  async createIfNotExistAndGetBalanceByUserId(userId: string) {
    const [res] = await this.db.select()
      .from(table.credit)
      .where(eq(table.credit.userId, userId))
    if(!res) {
      const [item] = await this.db.insert(table.credit).values({
        userId: userId,
        balance: 0,
      }).returning()
      return item
    }
    return res
  }

  async decreaseBalanceUserId(quota: number, userId: string) {
    const [res] = await this.db.update(table.credit)
      .set({
        balance: sql`${table.credit.balance}-${quota}`,
      })
      .where(and(eq(table.credit.userId, userId), gte(sql`${table.credit.balance}-${quota}`, 0)))
      .returning()
    return res
  }
  async increaseBalanceUserId(quota: number, userId: string) {
    const [res] = await this.db.update(table.credit)
      .set({
        balance: sql`${table.credit.balance}+${quota}`,
      })
      .where(and(eq(table.credit.userId, userId), gte(sql`${table.credit.balance}+${quota}`, 0)))
      .returning()
    return res
  }
}