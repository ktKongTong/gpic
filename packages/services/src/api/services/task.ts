import {UserService} from "./user-service";
import {DAO, TaskStatus, taskStatus, taskType, TaskUpdateDBO} from "../storage/type";
import {MQService, msgType} from "./mq";
import {getCloudflareEnv} from "../utils";
import { BatchState } from "./consumers";

type TaskInput = {
  input: any, parentId?: string
}

type BatchTaskInput = {
  inputs: any[],
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
    return this.dao.task.createTask({
      userId: user?.id ?? 'anonymous',
      input: task.input,
      type: taskType.BATCH,
      retry: 0,
      metadata: {},
    })
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
    if(!res || res.type !== taskType.BATCH) {
      return res
    }
    const key = `task:batch:state:${res.id}`
    // @ts-ignore
    const state = await getCloudflareEnv().KV.get<BatchState>(key)
    return {
      ...res,
      state
    }
  }

  async getTaskByUserId(userId: string, withHistory = true) {
    // limit to 20
    const tasks = await this.dao.task.getTasksByUserId(userId, withHistory)
    // const tasksId = tasks
    //   .filter(it => it.type == taskType.BATCH)
    //   .map(it => it.id)
    // const getKey = (it:string) => `task:batch:state:${it}`
    // metadata
    // @ts-ignore
    // const states = await getCloudflareEnv().KV.get<BatchState>(tasksId.map(it => getKey(it)))
    // const result = tasks.map(task => {
    //   if(task.type !== taskType.BATCH) {
    //     return task
    //   }
    //   const state = states.get(getKey(task.id))
    //   return {
    //     ...task,
    //     state: state
    //   }
    // })
    return tasks
  }

}