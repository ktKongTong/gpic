import { DAO } from "../libs/storage";
import { GalleryDAO } from "../libs/storage/dao/gallery";

// 获取 GalleryDAO 的方法类型
type GalleryDAOMethods = {
  [K in keyof GalleryDAO]: GalleryDAO[K] extends Function ? GalleryDAO[K] : never;
};

export type GalleryServiceType = GalleryDAOMethods

export class GalleryService {
  static create(dao: DAO) {
    const s = new GalleryService(dao);
    const proxy = new Proxy(s, {
        get: (target, prop: keyof GalleryServiceType) => {
          if (prop in target) {
            // @ts-ignore
            return target[prop].bind(target);
          }
          if (prop in s.dao.gallery) {
            // @ts-ignore
            return this.dao.gallery[prop].bind(this.dao.gallery);
          }
        }
      });
      return proxy as unknown as GalleryService & GalleryServiceType;
  }
  private constructor(private dao: DAO) {  }

  async getGalleryWithRelations(id: string) {
    const gallery = await this.dao.gallery.getGalleryById(id);
    if (gallery.styleId) {
      const style = await this.dao.style.getStyleById(gallery.styleId);
      return {
        ...gallery,
        style
      };
    }
    return gallery;
  }

  async getLatestGalleries(count: number = 20) {
    return await this.dao.gallery.listGalleries(count, 0);
  }
}
