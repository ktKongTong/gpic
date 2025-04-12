import {z} from "zod";
export * from './task'
export * from './styles'
export * from './common'
export type BatchState = {
  pending: number,
  processing: number,
  failed: number,
  completed: number,
  total: number,
}

export const styleSchema = z.union([z.object({ styleId: z.string() }), z.object({
  prompt: z.string(),
  reference: z.string().array(),
})])

export const versionSchema = z.object({
  version: z.string(),
}).catchall(z.any())

export type Versioned = z.infer<typeof versionSchema>

export const batchTaskInputSchema = versionSchema.extend({
  files: z.string().array().min(1).max(10, "Maximum 10 files"),
  styles: styleSchema.array().min(1).max(5, "Maximum 5 style"),
  count: z.coerce.number().min(1).max(100, "Maximum 100 count").optional().default(1),
  size: z.coerce.string().optional(),
}).refine((data) => {
  const total = data.styles.length * data.files.length * data.count
  return total <= 100
},{
  message: "total task count should be less than 100",
})

export const batchTaskMetadataSchema =versionSchema.extend({
  state: z.object({
    total: z.coerce.number(),
    pending: z.coerce.number(),
    processing: z.coerce.number(),
    completed: z.coerce.number(),
    failed: z.coerce.number(),
  }).optional(),
})

export const executionV1InputSchema = versionSchema.extend({
  file: z.string(),
  style: styleSchema,
  size: z.string().optional(),
})
export const executionV1OutputSchema = versionSchema.extend({
  url: z.string(),
})

export const executionStateSchema = versionSchema.extend({
  progress: z.coerce.number().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  failedReason: z.string().optional(),
})