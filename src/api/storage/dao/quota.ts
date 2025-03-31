import {DB} from "../type";
import * as table from '../schema'
import {eq} from "drizzle-orm";
export class QuotaDAO {

  constructor(private readonly db: DB) {
  }

  async getQuotaByUserId(userId: string) {
    const [res] = await this.db.select()
      .from(table.credit)
      .where(eq(table.credit.userId, userId))
    return res
  }
}