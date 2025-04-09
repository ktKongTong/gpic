import {UserService} from "./user-service";
import {DAO} from "../storage/type";

export class UserQuotaService {
  constructor(private readonly userService: UserService, private dao: DAO) {

  }

  async getQuota() {
    const user = await this.userService.getCurrentUser()
    // this.userService.getCurrentUser()
    const uid = user?.id ?? 'anonymous'
    const quota = this.dao.quota.getQuotaByUserId(uid)
    return quota
  }

}