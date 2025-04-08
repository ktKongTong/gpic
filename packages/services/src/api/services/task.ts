import {UserService} from "./user-service";
import {DAO, TaskStatus, taskStatus, taskType, TaskUpdateDBO} from "../storage/type";
import {MQService, msgType} from "./mq";
import {eventType, getDO} from "./druable-object";

type TaskInput = {
  input: any, parentId?: string
}

type BatchTaskInput = {
  inputs: { files: string[], style: string }[],
  parentId?: string,
  userId: string,
}


export class TaskService {
  constructor(
    private readonly userService: UserService,
    private readonly mqService: MQService,
    private readonly dao: DAO
  ) {

  }
  async createBatchImageGenTask(task: BatchTaskInput) {
    const tasks = task.inputs.map(it => ({
      userId: task.userId,
      input: it,
      type: taskType.IMAGE_GEN,
      retry: 0,
      metadata: {},
      parentId: task.parentId
    }))
    return this.dao.task.batchCreateTasks(tasks)
  }
  async createImageGenTask(task: TaskInput) {
    const user = await this.userService.getCurrentUser()
    return this.dao.task.createTask({
      userId: user?.id ?? 'anonymous',
      input: task.input,
      type: taskType.IMAGE_GEN,
      retry: 0,
      metadata: {},
      parentId: task.parentId
  })
  }

  async createBatchTask(task: TaskInput) {
    const user = await this.userService.getCurrentUser()
    const result = await this.dao.task.createTask({
      userId: user?.id ?? 'anonymous',
      input: task.input,
      type: taskType.BATCH,
      retry: 0,
      metadata: {},
    })
    await getDO(result.id)
      .onTaskEvent({
        taskId: result.id,
        event: eventType.BATCH_CREATE,
        payload: result })
    return result
  }

  async updateTask(task: TaskUpdateDBO, preStatus: TaskStatus) {
    const updated = await this.dao.task.updateTask(task)
    await this.mqService.enqueue({type: msgType.TASK_UPDATE, payload: {
      preStatus: preStatus,
      status: updated.status,
      taskId: updated.id,
      parentTaskId: updated.parentId
    }})
    return updated
  }
  async getTaskById(taskId: string, withHistory = true) {
    const res = await this.dao.task.getTaskById(taskId, withHistory)
    return res
  }

  async getTaskByUserId(userId: string, withHistory = true) {
    const tasks = await this.dao.task.getTasksByUserId(userId, withHistory)
    return tasks
  }

}