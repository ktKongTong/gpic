import {getCloudflareEnv} from "../utils";


export const getDO = (taskId: string) => {
  const id = getCloudflareEnv().DO_TASK_STATUS.idFromName(taskId)
  const stub = getCloudflareEnv().DO_TASK_STATUS.get(id)
  return stub
}