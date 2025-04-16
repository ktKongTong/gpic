import {UserService} from "./user-service";
import {BizError, ServiceError} from "../errors";
import { DAO } from "../libs/storage";
import {KVService} from "../kv";

type TaskOrderCreate = {
  taskId: string,
  cost: number
}

export class UserBalanceService {
  constructor(private readonly userService: UserService, private dao: DAO, private kv: KVService) {

  }

  async getBalance() {
    const anonymous = await this.userService.isAnonymousUser()
    if(anonymous) {
      const res = await this.kv.get<number>('user:balance:anonymous')
      return {
        balance: res ? Number(res) : 0,
        userId: 'anonymous',
      }
    }
    const uid = await this.getConsumeUserid()
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
    const anonymous = await this.userService.isAnonymousUser()
    const uid = await this.getConsumeUserid()
    let msg = ''
    if(anonymous) {
      if(order.cost > 5) {
        throw new ServiceError("Anonymous User can create only single task which cost 5 credit at once")
      }
      await this.kv.increaseBy('user:balance:anonymous', -order.cost, {
          min: {
            num: 0,
            message: 'no enough credit in anonymous wallet today'
          }
        })
      msg = `use anonymous shared wallet, cost ${order.cost} credit`
    }
    return this.dao.balance.createTaskOrder(uid, order.taskId, order.cost, msg)
  }

  async getConsumeUserid() {
    const user = await this.userService.getCurrentUser()
    return user!.id
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