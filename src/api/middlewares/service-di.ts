// import { getRequestContext } from '@cloudflare/next-on-pages'

import { Context, MiddlewareHandler } from "hono";
import { FileService } from "../services/file";
import { UserService } from "../services/user-service";
import { AIImageService } from "../services/ai/image";
import {UserQuotaService} from "@/api/services/quota";
import {getDAO} from "@/api/storage/db";
import {HistoryService} from "@/api/services/history";
import {TaskService} from "@/api/services/task";
import {MQService} from "@/api/services/mq";

// In the edge runtime you can use Bindings that are available in your application
// (for more details see:
//    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
//    - https://developers.cloudflare.com/pages/functions/bindings/
// )
//
// KV Example:
// const myKv = getRequestContext().env.MY_KV_NAMESPACE
// await myKv.put('suffix', ' from a KV store!')
// const suffix = await myKv.get('suffix')
// return new Response(responseText + suffix)

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
    // env: c.env,
    // ctx: c,
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
    const taskService = new TaskService(userService, dao)
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