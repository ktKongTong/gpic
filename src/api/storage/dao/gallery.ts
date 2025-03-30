import {DB} from "../type";
import * as table from '../schema'
export class HistoryDAO {

  constructor(private readonly db: DB) {
  }

  async getRecentHistory() {
    const res = await this.db.select()
      .from(table.history)
      .limit(10)

    return res
  }

}