import {UserService} from "@/api/services/user-service";
import {DAO} from "@/api/storage/type";

type TaskInput = {
  input: any,
}

export class TaskService {
  constructor(private readonly userService: UserService,private readonly dao: DAO) {

  }

  async createTask(task: TaskInput) {
    const user = await this.userService.getCurrentUser()
    return this.dao.task.createTask(user?.id ?? 'anonymous', task.input)
  }



}