import {DB, ExecutionCreateDBO, ExecutionUpdateDBO} from "../type";
import * as table from '../schema'
import {uniqueId} from "../../utils";
import {eq} from "drizzle-orm";



export class HistoryDAO {

  constructor(private readonly db: DB) {
  }

  async getRecentHistory() {
    const res = await this.db.select()
      .from(table.execution)
      .limit(10)
    return res
  }

  async createExecutionHistory(record: ExecutionCreateDBO) {
    const id = uniqueId(`exec`).toString()
    const [res] = await this.db.insert(table.execution)
      .values({
        id,
        ...record,
      }).returning()
    return res
  }

  async updateExecutionHistory(record: ExecutionUpdateDBO) {
    const {id, ...rest} = record
    const [res] = await this.db.update(table.execution)
      .set({ ...rest })
      .where(eq(table.execution.id, record.id))
      .returning()
    return res
  }

  async getExecutionHistoriesByTaskId(taskId: string) {
    const res = await this.db.select()
      .from(table.execution)
      .where(eq(table.execution.taskId, taskId))
    return res
  }


}