
import * as table from '../schema'
import {and, eq, getTableColumns, gte, isNull, sql} from "drizzle-orm";
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

  async createCoupon(count: number, amount: number, msg?: string) {
    this.db.select().from(table.exchangeCoupon)
    const createId = () => typeid('cp').toString()
    // const
    const exchangeCode = () => typeid().toString()
    const values = Array.from({length: count}).map(() => {
      return {
        id: createId(),
        code: exchangeCode(),
        amount: amount,
        msg,
      }
    })
    const res = await this.db.insert(table.exchangeCoupon)
      .values(values)
      .returning()
    return res
  }

  async redeemCoupon(code: string, userId: string) {
    this.db.select().from(table.exchangeCoupon)
    const [res] = await this.db.update(table.exchangeCoupon)
      .set({
        userId: userId,
      })
      .where(and(
        isNull(table.exchangeCoupon.userId),
        eq(table.exchangeCoupon.code, code)
      ))
      .returning()
      if(!res) {
        throw new DBError("code not found or has been used")
      }
    const id = typeid('order_').toString()
    const [[order]] = await this.db.batch([
      this.db.insert(table.order).values({
        id,
        userId,
        amount: res.amount,
        status: 'completed',
        voucherId: res.id,
        type: 'credit-add',
        msg: `use redeem code, id: ${res.id}`
      }).returning(),
      // may fail
      this.db.update(table.credit).set({
        balance: sql`${table.credit.balance} + ${res.amount}`
      }).where(eq(table.user.id, userId))
    ])
    return order
  }

  async getBalanceByUserId(userId: string) {
    const [res] = await this.db.select()
      .from(table.credit)
      .where(eq(table.credit.userId, userId))
    return res
  }
  async createPendingOrder(userId: string, amount: number, msg?: string) {
    const id =typeid('ord').toString()
    const [res] = await this.db.insert(table.order).values({
      id,
      userId,
      amount,
      type: 'credit-add',
      status: 'pending',
      msg,
    }).returning()
    return res
  }

  async completePendingOrder(orderId: string, amount: number,paddleTxId: string, msg?: string) {
    const [oldOrder] = await this.db.select().from(table.order).where(eq(table.order.id, orderId))
    await this.db.batch([
      this.db.update(table.order)
        .set({
          amount,
          msg,
          paddleTxId,
          status: 'completed'
        })
        .where(eq(table.order.id, orderId)),
      this.db.update(table.credit)
        .set({
          balance: sql`${table.credit.balance} + ${amount}`,
        })
        .where(eq(table.credit.userId, oldOrder.userId))
    ])
  }

  async createTaskOrder(userId: string, taskId: string, cost: number, msg: string) {
    const id =typeid('ord').toString()
    const [pendingOrder] = await this.db.insert(table.order).values({
      id,
      userId,
      taskId,
      type: 'task',
      amount: -cost,
      status: 'pending',
      msg,
    }).returning()

    let retry = 0
    while (retry < 3) {
      const [creditRes, [orderRes]] = await this.db.batch([
        this.db.update(table.credit)
          .set({
            balance: sql`${table.credit.balance} - ${cost}`,
          })
          .where(
            and(
              eq(table.credit.userId, userId),
              gte(sql`${table.credit.balance} - ${cost}`, 0)
            )
          ),
        this.db.update(table.order)
          .set({
            status: 'completed',
          })
          .where(eq(table.order.id, id))
          .limit(1)
          .returning()
      ])
      if(creditRes.success) {
        return orderRes
      }
    }
    throw new DBError(`failed to decrease balance userId: ${userId}, cost: ${cost}`)
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