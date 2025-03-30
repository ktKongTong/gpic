import {DAO} from "@/api/storage/type";

export class HistoryService {
  constructor(private dao: DAO) {

  }

  async getRecentHistory() {
    const history = await this
      .dao
      .history
      .getRecentHistory()
    const output = history.map(it => ({
      // @ts-ignore
      ...it.input,
      id: it.id,
      // @ts-ignore
      url: it.output?.url,
    }))
    return output
  }

}