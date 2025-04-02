import {UserService} from "../services/user-service";
import {DAO, TaskUpdateDBO} from "../storage/type";

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

  async updateTask(task: TaskUpdateDBO) {
    return await this.dao.task.updateTask(task)
  }

  async getTaskById(taskId: string, withHistory = true) {
    return await this.dao.task.getTaskById(taskId, withHistory)
  }

  async getTaskByUserId(userId: string, withHistory = true) {
    return await this.dao.task.getTasksByUserId(userId, withHistory)
  }


}