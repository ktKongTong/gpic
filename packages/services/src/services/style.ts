
import {i18nCode, StyleCreate, StyleUpdate, StyleI18nCreate} from "../shared";
import {DAO} from "../libs/storage";

export class StyleService {
  constructor(private dao: DAO) {
  }

  async createStyle(style: StyleCreate) {
    return await this.dao.style.createStyle(style);
  }

  async updateStyle(style: StyleUpdate) {
    return await this.dao.style.updateStyle(style);
  }

  async addStyleI18n(styleI18n: StyleI18nCreate) {
    return await this.dao.style.addStyleI18n(styleI18n);
  }

  async getStyles(preferI18n: i18nCode) {
    const styles = await this.dao.style.getStyles(preferI18n)
    return styles;
  }

  async getStyleById(id: string) {
    const styles = await this.dao.style.getStyleById(id)
    return styles;
  }
}