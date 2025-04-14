import * as table from '../schema'
import { desc, eq } from "drizzle-orm";
import { DB } from "../index";
import { typeid } from 'typeid-js';
import { DBError } from '../../../errors';

export interface GalleryCreate {
  description?: string;
  url: string;
  originUrl?: string;
  styleId?: string;
  input?: any;
  taskId?: string;
}

export interface GalleryUpdate extends Partial<GalleryCreate> {
  id: string;
}

export class GalleryDAO {
  constructor(private readonly db: DB) {
  }

  async createGallery(gallery: GalleryCreate) {
    const id = typeid('gal').toString();
    const result = await this.db.insert(table.gallery).values({
      id,
      ...gallery,
    }).returning();
    return result[0];
  }

  async updateGallery(gallery: GalleryUpdate) {
    const result = await this.db
      .update(table.gallery)
      .set(gallery)
      .where(eq(table.gallery.id, gallery.id))
      .returning();
    
    if (!result.length) {
      throw new DBError(`Gallery with id ${gallery.id} not found`);
    }
    
    return result[0];
  }

  async deleteGallery(id: string) {
    const result = await this.db
      .delete(table.gallery)
      .where(eq(table.gallery.id, id))
      .returning();
    
    if (!result.length) {
      throw new DBError(`Gallery with id ${id} not found`);
    }
    
    return result[0];
  }

  async getGalleryById(id: string) {
    const [result] = await this.db
      .select()
      .from(table.gallery)
      .where(eq(table.gallery.id, id));
    
    if (!result) {
      throw new DBError(`Gallery with id ${id} not found`);
    }
    
    return result;
  }

  async listGalleries(limit: number = 20, offset: number = 0) {
    const result = await this.db
      .select()
      .from(table.gallery)
      .orderBy(desc(table.gallery.createdAt))
      .limit(limit)
      .offset(offset);
    
    return result;
  }

  async findGalleriesByStyleId(styleId: string) {
    const result = await this.db
      .select()
      .from(table.gallery)
      .where(eq(table.gallery.styleId, styleId))
      .orderBy(desc(table.gallery.createdAt));
    
    return result;
  }
}