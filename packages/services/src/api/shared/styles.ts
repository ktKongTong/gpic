import {z} from "zod";

export const i18nCode = { ZH: 'zh-CN', EN: 'en-US', JP: 'ja-JP', KR: 'ko-KR' } as const

export type i18nCode = typeof i18nCode[keyof typeof i18nCode]
export const i18nCodeArr = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'] as const


export const styleSchema = z.union([
  z.object({
    styleId: z.string(),
  }),
  z.object({
    prompt: z.string(),
    reference: z.string().array(),
  })
])

export type StyleInfo = z.infer<typeof styleSchema>