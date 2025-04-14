import {getDAO} from "../libs/storage/db";
import {FileService} from "./file";
import {UserService} from "./user-service";
import { createMQService } from "../queue/producer";
import {TaskService} from "./task";
import {ExecutionService} from "./history";
import {StyleService} from "./style";
import {AIImageService} from "./ai/image";
import {MQMessage} from "../shared";

export const createService = (env: CloudflareEnv) => {
  const dao = getDAO(env)
  const fileService = new FileService();
  const userService = new UserService();
  const mqService = createMQService<MQMessage>(env)
  const taskService = new TaskService(dao);
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
