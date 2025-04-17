
import * as table from '../schema'
import {and, eq, getTableColumns, gte, sql} from "drizzle-orm";
import {typeid} from "typeid-js";
import {DBError} from "../../../errors";
import {DB} from "../index";
export class BalanceDAO {

  constructor(private readonly db: DB) {
  }

  async createWalletByUserId(userId: string, balance: number = 0) {
    const [res] = await this.db.insert(table.credit)
      .values({
        userId,
        balance
      }).returning()
    return res
  }
  async getBalanceByUserId(userId: string) {
    const [res] = await this.db.select()
      .from(table.credit)
      .where(eq(table.credit.userId, userId))
    return res
  }

  // todo transaction
  async createTaskOrder(userId: string, taskId: string, cost: number, msg: string) {
    const id =typeid('cost').toString()
    const s = this.db.update(table.credit)
      .set({
        balance: sql`${table.credit.balance} - ${cost}`,
      })
      .where(
        and(
          eq(table.credit.userId, userId),
          gte(sql`${table.credit.balance} - ${cost}`, 0)
        )
      )
    const [ok] = await s.returning()
    if(!ok) {
      throw new DBError(`failed to descrease balance userId: ${userId}, cost: ${cost}`)
    }
    const [res] = await this.db.insert(table.order).values({
      id,
      userId,
      taskId,
      count: cost,
      msg,
    }).returning()
    return res
  }

  async getOrdersByUserId(userId: string) {
    const {userId:uidColumn, ...rest} = getTableColumns(table.order)
    const res = await this.db.select({
      user: table.user,
      ...rest,
    }).from(table.order)
    .leftJoin(table.user, eq(table.user.id, table.order.userId))
    .leftJoin(table.task, eq(table.order.taskId, table.task.id))
    .where(eq(table.order.userId, userId))
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