import {UserService} from "./user-service";
import {DAO} from "../storage/type";
import {BizError} from "../errors";

type TaskOrderCreate = {
  taskId: string,
  cost: number
}

export class UserBalanceService {
  constructor(private readonly userService: UserService, private dao: DAO) {

  }

  async getBalance() {
    const user = await this.userService.getCurrentUser()
    const uid = user?.id ?? 'anonymous'
    const quota = this.dao.balance.createIfNotExistAndGetBalanceByUserId(uid)
    return quota
  }
  async getConsumeHistory() {
    const user = await this.userService.getCurrentUser()
    // this.userService.getCurrentUser()
    const uid = user?.id ?? 'anonymous'
    const orders = this.dao.balance.getOrdersByUserId(uid)
    return orders
  }

  async createTaskOrder(order: TaskOrderCreate) {
    // create task
    const user = await this.userService.getCurrentUser()
    const uid = user?.id ?? 'anonymous'
    return this.dao.balance.createTaskOrder(uid, order.taskId, order.cost)
  }


  async tryDecreaseBalance(point:number) {
    const user = await this.userService.getCurrentUser()
    const uid = user?.id ?? 'anonymous'
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
    const user = await this.userService.getCurrentUser()
    const uid = user?.id ?? 'anonymous'
    const remain = await this.dao.balance.createIfNotExistAndGetBalanceByUserId(uid)
    if(!remain) {
      throw new BizError(`User Not Found`, 400)
    }
    const quota = await this.dao.balance.increaseBalanceUserId(point, uid)
    return quota
  }

}