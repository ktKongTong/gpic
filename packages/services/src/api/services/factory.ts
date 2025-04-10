import {getDAO} from "../storage/db";
import {FileService} from "./file";
import {UserService} from "./user-service";
import {MQService} from "./mq";
import {TaskService} from "./task";
import {ExecutionService} from "./history";
import {StyleService} from "./style";
import {AIImageService} from "./ai/image";

export const createService = (env: CloudflareEnv) => {
  const dao = getDAO(env)
  const fileService = new FileService();
  const userService = new UserService();
  const mqService = new MQService()
  const taskService = new TaskService(userService, mqService, dao);
  const historyService = new ExecutionService(dao)
  const styleService = new StyleService(dao);
  const aiService = new AIImageService(fileService, styleService)
  return {
    aiService,
    mqService,
    taskService,
    userService,
    fileService,
    historyService
  }
}
