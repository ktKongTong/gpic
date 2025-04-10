import {DB} from "../type";
import * as table from '../schema'
import {and, eq, getTableColumns, max, or, sql, getViewSelectedFields} from "drizzle-orm";
import {i18nCode} from "../schema";
export class StyleDAO {
  constructor(private readonly db: DB) {
  }

  async getStyles(preferredI18n: i18nCode = i18nCode.EN) {
    const latestStyleCTE = this.db.$with('latest_style')
      .as(
        this.db
          .select()
          .from(table.style)
          .groupBy(table.style.styleId)
          .having(max(table.style.version))
      );
    const result = await this.db
      .with(latestStyleCTE)
      .select()
      .from(latestStyleCTE)
      .innerJoin(
        table.styleI18n,
        eq(latestStyleCTE.styleId, table.styleI18n.styleId)
      )
      .groupBy(table.styleI18n.styleId)
      .orderBy(
        sql`CASE WHEN ${table.styleI18n.i18n} = ${preferredI18n} THEN 0 ELSE 1 END`,
        table.styleI18n.id
      )

    return result.map(it => ({
      ...it.style_i18n,
      ...it.latest_style,
    }))
  }

  async getStyleById(styleId: string) {
    const [res] = await this.db.select().from(table.style).where(eq(table.style.id, styleId))
    return res
  }
}