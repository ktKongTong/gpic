import {getCloudflareEnv} from "../../utils";
import {BatchTaskStateDO} from "./durable-object";


export const getDO = (taskId: string) => {
  // @ts-ignore
  const id = getCloudflareEnv().DO_TASK_STATUS.idFromName(taskId)
  // @ts-ignore
  const stub = getCloudflareEnv().DO_TASK_STATUS.get(id)
  return stub as unknown as BatchTaskStateDO
}

export * from './durable-object'