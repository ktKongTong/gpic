import {UserService} from "../services/user-service";
import {DAO} from "../storage/type";

type TaskInput = {
  input: any,
}

export type Task = {
  metadata: unknown,
  input: unknown,
  id: string,
  createdAt: string,
  updatedAt: string,
  userId: string,
  type: string,
  status: string,
  retry: number
}

type TaskUpdateDBO = {
  id: string,
  // initial input
  input?: any,
  type?: string,
  retry?: number,
  status?: string,
  metadata?: any,
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