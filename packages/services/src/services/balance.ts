import {UserService} from "./user-service";
import {BizError, ServiceError} from "../errors";
import { DAO } from "../libs/storage";
import {KVService} from "../libs/kv";

type TaskOrderCreate = {
  taskId: string,
  cost: number
}


type PaddleOrderCreate = {
  userId: string,
  amount: number,
  priceId: string
  msg?: string
}

type PaddleOrderComplete = {
  paddleTxId: string,
  userId: string,
  orderId: string,
  amount: number,
  msg?: string
}

export class UserBalanceService {

  constructor(private readonly userService: UserService, private dao: DAO, private kv: KVService) {

  }
  async createRedeemCode(count: number, amount: number,msg?: string) {
    const isAdmin = await this.userService.checkIfAdmin()
    if(!isAdmin) {
      throw new ServiceError('Only admin can create coupon')
    }
    return await this.dao.balance.createCoupon(count, amount, msg)
  }
  async redeemCode(code: string) {
    const uid = await this.userService.getCurrentUserId()
    return await this.dao.balance.redeemCoupon(code, uid)
  }

  async getBalance() {
    const uid = await this.userService.getCurrentUserId()
    const quota = this.dao.balance.createIfNotExistAndGetBalanceByUserId(uid)
    return quota
  }

  async getOrders() {
    const user = await this.userService.getCurrentUser()
    const uid = user?.id!
    const orders = this.dao.balance.getOrdersByUserId(uid)
    return orders
  }

  async createTaskOrder(order: TaskOrderCreate) {
    const uid = await this.userService.getCurrentUserId()
    let msg = ''
    return this.dao.balance.createTaskOrder(uid, order.taskId, order.cost, msg)
  }

  async createPendingOrder(order: PaddleOrderCreate) {
    return this.dao.balance.createPendingOrder(order.userId, order.amount, order.msg)
  }

  async completePendingOrder(order: PaddleOrderComplete) {
    return this.dao.balance.completePendingOrder(order.orderId, order.amount,order.paddleTxId, order.msg)
  }
}