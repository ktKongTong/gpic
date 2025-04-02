import {DB, TaskStatus, taskStatus, taskType, TaskUpdateDBO} from "../type";
import * as table from '../schema'
import {desc, eq, getTableColumns} from "drizzle-orm";
import {uniqueId} from "../../utils";

const taskColumns = getTableColumns(table.task)
const historyColumns = getTableColumns(table.history)
type TaskColumn = typeof table.task.$inferSelect
type WithHistoryColumn = {
  history: typeof table.history.$inferSelect;
} & TaskColumn

type ReturnTypeTask<withHistory extends boolean = false> = withHistory extends true
  ? WithHistoryColumn : TaskColumn



export class TaskDAO {

  constructor(private readonly db: DB) {
  }

  async createTask(userId: string, input: any) {
    const id = uniqueId('task').toString()
    const [res] = await this.db.insert(table.task).values({
      id,
      userId,
      input,
      type: taskType.IMAGE_GEN,
      retry: 0,
      status: taskStatus.WAITING,
      metadata: {},
    }).returning()
    return res
  }

  async updateTask(taskUpdateDBO: TaskUpdateDBO) {
    const {id, ...rest} = taskUpdateDBO
    const [res] = await this.db.update(table.task).set({ ...rest })
    .where(eq(table.task.id, id))
    .returning()
    return res
  }

  async getTaskById<T extends boolean>(id: string, withHistory: T = true as T): Promise<ReturnTypeTask<T> | undefined> {
    // newest task with history
    if (withHistory) {
      const [result] = await this.db.select({
        ...taskColumns,
        history: historyColumns,
      }).from(table.task)
        .leftJoin(table.history, eq(table.task.id, table.history.id))
        .orderBy(desc(table.history.createdAt))
        .where(eq(table.task.id, id))
      return result as ReturnTypeTask<T>
    }
    const [result] = await this.db.select()
      .from(table.task)
      .where(eq(table.task.id, id))
    return result as ReturnTypeTask<T>
  }

  async getTasksByUserId<T extends boolean>(userId: string, withHistory: T = true as T): Promise<ReturnTypeTask<T>[]> {
    if (withHistory) {
      const result = await this.db.select({
        ...taskColumns,
        history: historyColumns,
      }).from(table.task)
        .leftJoin(table.history, eq(table.task.id, table.history.id))
        .orderBy(desc(table.history.createdAt))
        .where(eq(table.task.userId, userId))
      return result as ReturnTypeTask<T>[]
    }
    const result = await this.db.select()
      .from(table.task)
      .where(eq(table.task.userId, userId))
    return result as ReturnTypeTask<T>[]
  }
}