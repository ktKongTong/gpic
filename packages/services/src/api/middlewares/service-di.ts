import { Context, MiddlewareHandler } from "hono";
import {
  FileService,
  HistoryService,
  UserService,
  AIImageService,
  UserQuotaService,
  MQService,
  StyleService,
  TaskService
} from "../services";

import {getDAO} from "../storage/db";

declare module 'hono' {
  interface ContextVariableMap {
    userService: UserService
    aiImageService: AIImageService
    fileService: FileService
    userQuotaService: UserQuotaService
    historyService: HistoryService
    taskService: TaskService
    mqService: MQService
    styleService: StyleService
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
    styleService: c.get('styleService'),
  }
}



export const ServiceDIMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const userService = new UserService()
    const fileService = new FileService()
    const dao = getDAO()
    const styleService = new StyleService(dao)
    const aiImageService = new AIImageService(fileService, styleService)
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
    c.set('styleService', styleService)
    await next()
  }
}