import { Context, MiddlewareHandler } from "hono";
import { FileService } from "../services";
import { UserService } from "../services";
import { AIImageService } from "../services";
import {UserQuotaService} from "../services";
import {getDAO} from "../storage/db";
import {HistoryService} from "../services";
import {TaskService} from "../services";
import {MQService} from "../services";

declare module 'hono' {
  interface ContextVariableMap {
    userService: UserService
    // eventService: EventService
    aiImageService: AIImageService
    fileService: FileService
    userQuotaService: UserQuotaService
    historyService: HistoryService
    taskService: TaskService
    mqService: MQService
  }
}
export const getService = (c:Context) => {
  return {
    fileService: c.get('fileService'),
    userService: c.get('userService'),
    aiImageService: c.get('aiImageService'),
    userQuotaService: c.get('userQuotaService'),
    historyService: c.get('historyService'),
    taskService: c.get('taskService'),
    mqService: c.get('mqService'),
  }
}



export const ServiceDIMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const userService = new UserService()
    const fileService = new FileService()
    const aiImageService = new AIImageService(fileService)
    const dao = getDAO()
    const quotaService = new UserQuotaService(userService, dao)
    const mqService = new MQService()
    const taskService = new TaskService(userService, mqService, dao)
    const historyService = new HistoryService(dao)
    c.set('userService', userService)
    c.set('fileService', fileService)
    c.set('aiImageService', aiImageService)
    c.set('userQuotaService', quotaService)
    c.set('historyService', historyService)
    c.set('taskService', taskService)
    c.set('mqService', mqService)
    await next()
  }
}