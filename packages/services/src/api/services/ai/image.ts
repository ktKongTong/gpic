import { FileService } from "../file";
import {createModel, createPrompt, createPromptV2} from "./sdk";
import { streamText,TextStreamPart } from "ai";
import {StyleService} from "../style";

// @ts-ignore
function formatSSE(data, type = 'message', id = Date.now()) {
  return `id: ${id}\nevent: ${type}\ndata: ${data}\n\n`;
}

type SSEvent = {
  id: string
  data: any
  event: string
}
type GenerateOption = {
  files: string[],
  style: string,
  prompt?: string
}

type GenerateOptionV2 = {
  files: string[],
  style: {styleId: string} | {prompt: string, reference: string[]},
  size: string,
}
export class AIImageService {

    constructor(private fileService: FileService, private styleService: StyleService) {}

    async generateImage(option: GenerateOption) {
        const model = await createModel()
        const prompt = await createPrompt(option)
        const result = streamText({
            model: model,
            messages: [{ role: 'user' as const, content: prompt }],
            maxRetries: 3,
            maxTokens: 8192,
        })

      const res = result
      return res
    }

  async generateImageV2(option: GenerateOptionV2) {
    const model = await createModel()
    const prompt = await createPromptV2(this.styleService, option)
    const result = streamText({
      model: model,
      messages: [{ role: 'user' as const, content: prompt }],
      maxRetries: 3,
      maxTokens: 8192,
    })
    const res = result
    return res
  }

    async handleTextDelta(text: string) {
      console.log(text)
      if(imageRegex.test(text)) {
        // @ts-ignore
        const [,url] = imageRegex.exec(text)
        const res = await fetch(url).then(res=>res.bytes())
        const file = await this.fileService.uploadFile(res, 'ai')
        return {
          data: file,
          event: 'success'
        }
      }else if(progressRegex.test(text)) {
        // @ts-ignore
        const [,progress] = progressRegex.exec(text);
        return { event: 'progress', data: progress as string}
      }else if(failedRegex.test(text)) {
        return { event: 'failed', data: 'meet rate-limit or content-policy'}
      }
      return {
        data: text,
        event: 'unknown'
      }
    }
}
const failedRegex = /❌/
const successRegex = /✅/
const progressRegex = /(\d{1,2})%/
const imageRegex = /\[.+]\((https:\/\/.+)\)/
