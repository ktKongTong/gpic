import {UserService} from "./user-service";
import {BizError} from "../errors";
import { DAO } from "../libs/storage";

type TaskOrderCreate = {
  taskId: string,
  cost: number
}

export class UserBalanceService {
  constructor(private readonly userService: UserService, private dao: DAO) {

  }

  async getBalance() {
    const uid = await this.getConsumeUserid()
    const quota = this.dao.balance.createIfNotExistAndGetBalanceByUserId(uid)
    return quota
  }
  async getOrders() {
    const user = await this.userService.getCurrentUser()
    const uid = user?.id ?? 'anonymous'
    const orders = this.dao.balance.getOrdersByUserId(uid)
    return orders
  }

  async createTaskOrder(order: TaskOrderCreate) {
    const uid = await this.getConsumeUserid()
    return this.dao.balance.createTaskOrder(uid, order.taskId, order.cost)
  }

  // all anonymous user share the same balance
  async getConsumeUserid() {
    const user = await this.userService.getCurrentUser()
    const isAnonymous = await this.userService.isAnonymousUser()
    const uid = isAnonymous ? 'anonymous' : user?.id ?? 'anonymous'
    return uid
  }

  async tryDecreaseBalance(point:number) {
    const uid = await this.getConsumeUserid()
    const quota = await this.dao.balance.decreaseBalanceUserId(point, uid)
    if(quota) {
      return quota
    }
    const remain = await this.dao.balance.getBalanceByUserId(uid)
    if(!remain) {
      throw new BizError(`User Not Found`, 400)
    }
    throw new BizError(`balance is not enough, require ${point} point, but only ${remain.balance} left`, 400)
  }

  async increaseBalance(point:number) {
    const uid = await this.getConsumeUserid()
    const remain = await this.dao.balance.createIfNotExistAndGetBalanceByUserId(uid)
    if(!remain) {
      throw new BizError(`User Not Found`, 400)
    }
    const quota = await this.dao.balance.increaseBalanceUserId(point, uid)
    return quota
  }

}