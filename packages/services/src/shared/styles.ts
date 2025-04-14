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

// 新增类型定义
export interface Style {
  id: string
  styleId: string
  version: number
  type: 'system' | 'user'
  reference: string[]
  prompt: string
}

export interface StyleI18n {
  id: string
  styleId: string
  i18n: i18nCode
  name: string
  aliases: string[]
  description?: string
}

export interface StyleWithI18n extends Style, StyleI18n {}

export type StyleCreate = Omit<Style, 'id' | 'version'>
export type StyleUpdate = Pick<Style, 'styleId' | 'prompt' | 'reference'>
export type StyleI18nCreate = Omit<StyleI18n, 'id'>