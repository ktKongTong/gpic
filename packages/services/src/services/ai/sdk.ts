import { createOpenAI } from '@ai-sdk/openai';
import {ImagePart, TextPart, UserContent} from "ai";
import {StyleService} from "../style";
import { NotFoundError } from "../../errors";
import {backendEnv} from "../../libs/env";




  // modelName.startsWith('gemini') ? gemini(modelName): openai(modelName)
export const createModel = async (env?: CloudflareEnv) => {
  const baseURL = backendEnv(env).AI_BASE_URL
  const apiKey = backendEnv(env).AI_API_KEY
  const modelName = backendEnv(env).AI_MODEL_NAME
  const openai = createOpenAI({ baseURL: baseURL, apiKey: apiKey });
  // const gemini = createGoogleGenerativeAI({
  //   baseURL: baseURL,
  //   apiKey: apiKey,
  // })
  const model =openai(modelName)
  return Promise.resolve(model)
}

export const createPrompt = async (option:{
  files: string[],
  style: string,
  prompt?: string
}): Promise<UserContent> => {
  const inputImages = option.files
    .slice(0,3).map(it => ({ type: "image" as const, image: it }))
    if (option.style === 'ghibli') {
      return [
        ...inputImages,
        { type: "text", text: "Make this Ghibli inspired Style。请确保结果符合内容政策指南。" },
      ]
    }

  if (option.style === 'rick-and-morty') {
    return [
      ...inputImages,
      { type: "text", text: "Make this RickAndMorty inspired Style。请确保结果符合内容政策指南。" },
    ]
  }
  return [
    ...inputImages,
    { type: "text", text: "Make this sticker Style。请确保结果符合内容政策指南。" },
  ]
}


const getSizePrompt = (size: string): TextPart => {
  switch (size) {
    case '1x1':
      return { type: "text", text: `控制图片尺寸为：1:1` }
    case '3x2':
      return { type: "text", text: `控制图片尺寸为：3:2` }
    case '2x3':
      return { type: "text", text: `控制图片尺寸为：2:3` } as TextPart
  }
  return { type: "text", text: `注意保持原图尺寸` } as TextPart
}

type V2Input = {
  files: string[],
  style: { styleId: string } | {prompt: string, reference: string[]},
  size: string
}

export const createPromptV2 = async (styleService: StyleService,option:V2Input): Promise<UserContent> => {
  const inputImages = option.files
    .map(it => ({ type: "image" as const, image: it }))
  let reference = [] as ImagePart[]
  let prompt = ''
  if((option.style as any)?.styleId) {
    const id = (option.style as any).styleId as string
    const style = await styleService.getStyleById(id)
    if(!style) {
      throw new NotFoundError(`Style ID:[${id}] Not Found`)
    }
    prompt = style.prompt
    reference = style.reference.map(it => ({ type: "image" as const, image: it }))
  }else if((option.style as any)?.prompt) {
    prompt = (option.style as any).prompt
    reference = (option.style as any).reference?.map((it: string) => ({ type: "image" as const, image: it })) ?? []
  }
  return [
    ...reference,
    ...inputImages,
    { type: "text", text: prompt },
    getSizePrompt(option.size)
  ]
}