import {DAO, ExecutionCreateDBO, ExecutionUpdateDBO} from "../storage/type";
import {executionStatus} from "../shared";


export class ExecutionService {
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

  async startExecution(record: Omit<ExecutionCreateDBO, 'startedAt' | 'status'>) {
    return this.createExecutionHistory({
      ...record,
      startedAt: new Date(),
      status: executionStatus.PROCESSING
    })
  }

  async updateExecutionHistory(record: ExecutionUpdateDBO) {
    return await this.dao.history.updateExecutionHistory(record)
  }

  async getExecutionHistoriesByTaskId(taskId: string) {
    return await this.dao.history.getExecutionHistoriesByTaskId(taskId)
  }

}