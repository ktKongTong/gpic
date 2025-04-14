import * as table from '../schema'
import {desc, eq, getTableColumns, or, sql, inArray, and} from "drizzle-orm";
import {uniqueId} from "../../../utils";
import {taskStatus, TaskUpdateDBO} from "../../../shared";
import {DB} from "../index";

const taskColumns = getTableColumns(table.task)
const historyColumns = getTableColumns(table.execution)
type TaskColumn = typeof table.task.$inferSelect
type TaskInsert = typeof table.task.$inferInsert
type ExecutionColumn = (typeof table.execution.$inferSelect)
type CommonColumn = TaskColumn & {
  children?: CommonColumn[]
}
type WithHistoryColumn = {
  executions: ExecutionColumn[];
  children?: WithHistoryColumn[]
} & TaskColumn

type ReturnTypeTask<withHistory extends boolean = false> = withHistory extends true
  ? WithHistoryColumn : CommonColumn

const chunk = <T>(arr: T[], chunkSize: number): T[][] => {
  return arr.reduce((acc, currentValue, currentIndex) => {
    if(acc.length == 0 || acc[acc.length - 1].length == chunkSize) acc.push([])
    acc[acc.length - 1].push(currentValue)
    return acc
  }, [] as (typeof arr)[])
}

export class TaskDAO {

  constructor(private readonly db: DB) {
  }

  async createTask(input: Omit<TaskInsert, 'id' | 'createdAt' | 'updatedAt' | 'status'>) {
    const id = uniqueId('task').toString()
    const [res] = await this.db.insert(table.task).values({
      id,
      status: taskStatus.PENDING,
      ...input
    }).returning()
    return res
  }

  async batchCreateTasks(inputs: Omit<TaskInsert, 'id' | 'createdAt' | 'updatedAt' | 'status'>[]) {
    const tasks = inputs.map(it => ({
      ...it,
      status: taskStatus.PENDING,
      id: uniqueId('task').toString()
    }))
    const db = this.db
    const tasksChunk = chunk(tasks, 5)
    const [query, ...rest] = tasksChunk.map(tasks =>
      db.insert(table.task).values(tasks).returning()
    )
    const res = await this.db.batch([query, ...rest])
    // const res = await this.db.insert(table.task).values(tasks).returning()
    return res.flat()
  }

  async updateTask(taskUpdateDBO: TaskUpdateDBO) {
    const {id, ...rest} = taskUpdateDBO
    const [res] = await this.db.update(table.task).set({ ...rest })
    .where(eq(table.task.id, id))
    .returning()
    return res
  }


  async retryTasks(taskIds: string[]) {
    const updatedTasks = await this.db.update(table.task)
      .set({
        status: taskStatus.PENDING,
        retry: sql`${table.task.retry} + 1`,
        startedAt: null,
        endedAt: null,
      })
      .where(
        and(
          or(eq(table.task.status, taskStatus.FAILED), eq(table.task.status, taskStatus.SUCCESS)),
          inArray(table.task.id, taskIds),
        )
      )
      .returning()
    return updatedTasks
  }

  async getChildrenByTaskId(taskId: string) {
    const res = await this.db.select()
      .from(table.task)
      .where(eq(table.task.parentId, taskId))
    return res
  }

  async getTaskById<T extends boolean>(id: string, userId?: string, withHistory: T = true as T): Promise<ReturnTypeTask<T> | undefined> {
    let condition = or(eq(table.task.id, id), eq(table.task.parentId, id))
    if (userId) {
      condition = and(eq(table.task.userId, userId), condition)
    }
    if (withHistory) {
      const s = this.db.select({
        task: taskColumns,
        execution: historyColumns,
      }).from(table.task)
        .leftJoin(table.execution, eq(table.task.id, table.execution.taskId))
        .orderBy(desc(table.execution.createdAt))
        .where(condition)
      const rows = await s
      const result = rows.reduce<Record<string, TaskColumn & { executions: ExecutionColumn[] }>>(
        (acc, row, idx, array) => {
          const {execution, task} = row;
          if (!acc[task.id]) {
            acc[task.id] = { ...task, executions: [] }
          }
          if (execution) {
            acc[task.id].executions.push(execution);
          }
          return acc;
        },
        {});
      const resultArray = Object.values(result)
      const resArr = resultArray
        .filter(it => it.id === id)
        .map(it => ({
          ...it,
          children: resultArray.filter(item => item.parentId === it.id)
        }))
      const res = resArr.find(it => it.id === id)
      return res as ReturnTypeTask<T>
    }
    const [result] = await this.db.select()
      .from(table.task)
      .where(eq(table.task.id, id))
    return result as ReturnTypeTask<T>
  }

  async getTasksByUserId<T extends boolean>(userId: string, withHistory: T = true as T): Promise<ReturnTypeTask<T>[]> {
    if (withHistory) {
      const rows = await this.db.select({
          task: getTableColumns(table.task),
          execution: getTableColumns(table.execution),
        }).from(table.task)
        .leftJoin(table.execution, eq(table.task.id, table.execution.taskId))
        .orderBy(desc(table.task.createdAt))
        .where(eq(table.task.userId, userId))
      const result = rows.reduce<Record<string, TaskColumn & { executions: ExecutionColumn[] }>>(
        (acc, row, idx, array) => {
          const {execution, task} = row;
          if (!acc[task.id]) {
            acc[task.id] = { ...task, executions: [] }
          }
          if (execution) {
            acc[task.id].executions.push(execution);
          }
          return acc;
        },
        {}
      );
      const resultArray = Object.values(result)
      const res = Object.values(result)
        .filter(it => !it.parentId)
        .map(it => ({...it,
          children: resultArray.filter(item => item.parentId === it.id)
        }))
      return res as ReturnTypeTask<T>[]
    }
    const result = await this.db.select()
      .from(table.task)
      .where(eq(table.task.userId, userId))
    return result as ReturnTypeTask<T>[]
  }
}