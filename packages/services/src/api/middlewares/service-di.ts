import { Context, MiddlewareHandler } from "hono";
import {
  FileService,
  ExecutionService,
  UserService,
  AIImageService,
  UserBalanceService,
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
    userBalanceService: UserBalanceService
    historyService: ExecutionService
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
    userBalanceService: c.get('userBalanceService'),
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
    const userBalanceService = new UserBalanceService(userService, dao)
    const mqService = new MQService()
    const taskService = new TaskService(userService, mqService, dao)
    const historyService = new ExecutionService(dao)
    c.set('userService', userService)
    c.set('fileService', fileService)
    c.set('aiImageService', aiImageService)
    c.set('userBalanceService', userBalanceService)
    c.set('historyService', historyService)
    c.set('taskService', taskService)
    c.set('mqService', mqService)
    c.set('styleService', styleService)
    await next()
  }
}