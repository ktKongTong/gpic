import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {backendEnv} from "../env";




  // modelName.startsWith('gemini') ? gemini(modelName): openai(modelName)
export const createModel = async (env?: CloudflareEnv) => {
  console.log("loading models")
  const baseURL = backendEnv(env).AI_BASE_URL
  const apiKey = backendEnv(env).AI_API_KEY
  const modelName = backendEnv(env).AI_MODEL_NAME
  const openai = createOpenAI({
    baseURL: baseURL,
    name: "picit",
    apiKey: apiKey,
  });
  const gemini = createGoogleGenerativeAI({
    baseURL: baseURL,
    apiKey: apiKey,
  })
  const model =openai(modelName)
  return Promise.resolve(model)
}

export const createPrompt = async (style?: string) => {
  return Promise.resolve("将照片转为动漫风格，灵感来源于千与千寻、龙猫、哈尔的移动城堡和起风了，富有梦幻和奇幻的元素。确保结果符合内容政策指南")
  // if(style == 'ghibli') {
  //   return Promise.resolve("Make this ghibli anime style")
  // }else if(style == 'sticker') {
  //   return Promise.resolve("Make this sticker style")
  // }
  // return Promise.resolve("Make this rick and morty style")
}