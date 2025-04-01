import {DAO} from "../storage/type";

type ExecutionCreateDBO = {
  taskId: string,
  usage: number,
  input: any,
  status: string
}

type ExecutionUpdateDBO = {
  id: string,
  output?: any,
  state?: any,
  status: string
}

export class HistoryService {
  constructor(private dao: DAO) {

  }

  async getRecentHistory() {
    const history = await this
      .dao
      .history
      .getRecentHistory()
    return history
  }

  async createExecutionHistory(record: ExecutionCreateDBO) {
    return await this.dao.history.createExecutionHistory(record)
  }

  async updateExecutionHistory(record: ExecutionUpdateDBO) {
    return await this.dao.history.updateExecutionHistory(record)
  }

  async getExecutionHistoriesByTaskId(taskId: string) {
    return await this.dao.history.getExecutionHistoriesByTaskId(taskId)
  }

}