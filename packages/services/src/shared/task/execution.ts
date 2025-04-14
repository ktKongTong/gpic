import {z} from "zod";
import { versionSchema} from "../common";
import {styleSchema} from "../styles";

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
