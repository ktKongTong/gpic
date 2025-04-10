import {UserService} from "./user-service";
import {DAO} from "../storage/type";
import {i18nCode} from "../storage/schema";

export class StyleService {

  constructor(private dao: DAO) {

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