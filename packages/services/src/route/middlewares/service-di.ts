import { Context, MiddlewareHandler } from "hono";
import {
  FileService,
  ExecutionService,
  UserService,
  AIImageService,
  UserBalanceService,
  ConsumerService,
  StyleService,
  TaskService
} from "../../services";
import {createMQService, MQService} from "../../libs/queue/producer";
import { getDAO } from "../../libs/storage/db";
import {MQMessage} from "../../shared";
import { GalleryService } from "../../services/gallery";
import {createKVService} from "../../libs/kv";



declare module 'hono' {
  interface ContextVariableMap {
    userService: UserService
    aiImageService: AIImageService
    fileService: FileService
    userBalanceService: UserBalanceService
    historyService: ExecutionService
    galleryService: GalleryService
    taskService: TaskService
    consumerService: ConsumerService
    mqService: MQService<MQMessage>
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
    consumerService: c.get('consumerService'),
    styleService: c.get('styleService'),
    galleryService: c.get('galleryService'),
  }
}



export const ServiceDIMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const userService = new UserService({
      reqGetter: () => c.req.raw,
      cache: {
        set: (k,v) => c.set(k as any, v),
        get: (k) => c.get(k as any)
      }
    })
    const fileService = new FileService()
    const dao = getDAO()
    const styleService = new StyleService(dao)
    const aiImageService = new AIImageService(fileService, styleService)
    const kv = createKVService(c.env)
    const mqService = createMQService()
    const userBalanceService = new UserBalanceService(userService, dao, kv)
    const taskService = new TaskService(dao)
    const historyService = new ExecutionService(dao)
    const galleryService = GalleryService.create(dao)
    const consumerService = new ConsumerService(c.env)
    c.set('userService', userService)
    c.set('consumerService', consumerService)
    c.set('fileService', fileService)
    c.set('aiImageService', aiImageService)
    c.set('userBalanceService', userBalanceService)
    c.set('historyService', historyService)
    c.set('galleryService', galleryService)
    c.set('taskService', taskService)
    c.set('mqService', mqService)
    c.set('styleService', styleService)
    await next()
  }
}