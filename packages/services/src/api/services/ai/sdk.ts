import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {backendEnv} from "../env";
import {UserContent} from "ai";




  // modelName.startsWith('gemini') ? gemini(modelName): openai(modelName)
export const createModel = async (env?: CloudflareEnv) => {
  const baseURL = backendEnv(env).AI_BASE_URL
  const apiKey = backendEnv(env).AI_API_KEY
  const modelName = backendEnv(env).AI_MODEL_NAME
  const openai = createOpenAI({ baseURL: baseURL, name: "picit", apiKey: apiKey });
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