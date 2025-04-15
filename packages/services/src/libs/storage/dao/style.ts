
import * as table from '../schema'
import { desc, eq, max, sql,and } from "drizzle-orm";
import {i18nCode, StyleCreate, StyleUpdate, StyleI18nCreate, StyleWithI18n} from "../../../shared";
import {DB} from "../index";
import { typeid } from 'typeid-js';
import { DBError } from '../../../errors';

export class StyleDAO {
  constructor(private readonly db: DB) {
  }
  
  async createStyle(style: StyleCreate) {
    const id = typeid('st').toString()
    const result = await this.db.insert(table.style).values({
      id,
      ...style,
    })
    .returning();
    return result[0];
  }

  async updateStyle(style: StyleUpdate) {
    const [currentStyle] = await this.db
      .select()
      .from(table.style)
      .where(eq(table.style.styleId, style.styleId))
      .orderBy(desc(table.style.version))
      .limit(1);
    
    if (!currentStyle) {
      throw new DBError(`Style with styleId ${style.styleId} not found`);
    }
    
    const newStyle = {
      id: typeid('st').toString(),
      ...style,
      type: currentStyle.type, // 保持原有的类型
      version: currentStyle.version + 1,
    };
    
    const result = await this.db.insert(table.style).values(newStyle).returning();
    return result[0];
  }

  async addStyleI18n(styleI18n: StyleI18nCreate) {
    const id = typeid('sti').toString();
    const result = await this.db
      .insert(table.styleI18n)
      .values({
        id,
        ...styleI18n
      })
      .onConflictDoUpdate({
        target: [table.styleI18n.styleId, table.styleI18n.i18n],
        set: styleI18n
      })
      .returning();
    return result[0];
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

  async removeStyleById(id: string) {
    return this.db.delete(table.style).where(eq(table.style.id, id))
  }
}