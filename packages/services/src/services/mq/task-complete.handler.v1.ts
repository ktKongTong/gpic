import {createService} from "../factory";
import {setCloudflareEnv} from "../../utils";
import {Task} from "../../shared";

export class TaskCompleteHandlerV1 {

  services: ReturnType<typeof createService>
  constructor(private readonly env: CloudflareEnv) {
    setCloudflareEnv(env)
    this.services = createService(env);
  }
  async handleTaskComplete(task: Task) {
    //TODO send email / call webhook
    console.log("task complete", task)
    // webhooks
  }

}