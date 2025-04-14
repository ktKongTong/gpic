import {versionSchema} from "../common";
import {z} from "zod";
import {styleSchema} from "../styles";

export type BatchState = {
  pending: number,
  processing: number,
  failed: number,
  completed: number,
  total: number,
}

export const defaultBatchState = { total: 0, pending: 0, processing: 0, completed: 0, failed: 0 }

export const batchTaskMetadataSchema =versionSchema.extend({
  state: z.object({
    total: z.coerce.number(),
    pending: z.coerce.number(),
    processing: z.coerce.number(),
    completed: z.coerce.number(),
    failed: z.coerce.number(),
  }).optional(),
})




export const batchTaskInputSchema = versionSchema.extend({
  files: z.string().array().min(1).max(10, "Maximum 10 file"),
  styles: styleSchema.array().min(1, "please choose one style at least").max(5, "Maximum 5 style"),
  count: z.coerce.number().min(1, "minimal count 1").max(100, "Maximum count 100").optional().default(1),
  size: z.coerce.string().optional(),
}).refine((data) => {
  const total = data.styles.length * data.files.length * data.count
  return total <= 100
},{
  message: "total task count should be less than 100",
})