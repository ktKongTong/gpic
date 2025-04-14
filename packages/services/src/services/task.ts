import {taskType, TaskUpdateDBO} from "../shared";
import type {DAO} from "../libs/storage";

type TaskInput = {
  input: any,
  userId: string
  parentId?: string,
}

type BatchTaskInput = {
  inputs: any[],
  parentId?: string,
  userId: string,
}


export class TaskService {
  constructor(private readonly dao: DAO) {}

  async createImageGenTask(task: TaskInput) {
    return this.dao.task.createTask({
      userId: task.userId,
      input: task.input,
      parentId: task.parentId,
      type: taskType.IMAGE_GEN,
      retry: 0,
      metadata: { version: '1' }
    })
  }

  async createBatchTask(task: TaskInput) {
    const result = await this.dao.task.createTask({
      userId: task.userId,
      input: task.input,
      type: taskType.BATCH,
      retry: 0,
      metadata: {
        version: '1'
      },
    })
    return result
  }

  async createBatchImageGenTask(task: BatchTaskInput) {
    const tasks = task.inputs.map(it => ({
      userId: task.userId,
      input: it,
      type: taskType.IMAGE_GEN,
      retry: 0,
      metadata: {
        version: '1'
      },
      parentId: task.parentId
    }))
    return this.dao.task.batchCreateTasks(tasks)
  }
  async getChildrenByTaskId(taskId: string) {
    return this.dao.task.getChildrenByTaskId(taskId)
  }

  async retryTasks(taskIds: string[]) {
    return this.dao.task.retryTasks(taskIds)
  }


  async updateTask(task: TaskUpdateDBO) {
    const updated = await this.dao.task.updateTask(task)
    return updated
  }

  async getTaskByIdAndUserId(taskId: string, userId?: string, withHistory = true) {
    const res = await this.dao.task.getTaskById(taskId, userId, withHistory)
    return res
  }
  async getTaskById(taskId: string, withHistory = true) {
    const res = await this.dao.task.getTaskById(taskId, undefined, withHistory)
    return res
  }

  async getTaskByUserId(userId: string, withHistory = true) {
    const tasks = await this.dao.task.getTasksByUserId(userId, withHistory)
    return tasks
  }

}