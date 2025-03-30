import { FileService } from "../file";
import { createModel, createPrompt } from "./sdk";
import {streamText, TextStreamPart} from "ai";
import Stream, {Readable, Transform, Writable } from "node:stream";


// @ts-ignore
function formatSSE(data, type = 'message', id = Date.now()) {
  return `id: ${id}\nevent: ${type}\ndata: ${data}\n\n`;
}

type SSEvent = {
  id: string
  data: any
  event: string
}

const aiEventTransform = new TransformStream<TextStreamPart<{}>, SSEvent>({
  // start: async (controller): Promise<void> => {
  //   controller.enqueue({event: 'start', data: 'drawing', id: Date.now().toString()})
  // },
  transform: async (chunk: TextStreamPart<{}>, controller) => {
    controller.enqueue({ event: 'message', id: Date.now().toString(), data: chunk});
    // if(chunk.type === 'error') {
    //   controller.error(chunk.error)
    // } else if (chunk.type === 'text-delta') {
    //   // const res = await aiImageService.handlerPartResponse(chunk)
    //   // const sseEvent = formatSSE(res.partUrl, res.event);
    //   // const res = await aiImageService.handlerPartResponse(chunk.textDelta)
    //   controller.enqueue({ event: 'message', id: Date.now().toString(), data: chunk});
    // }
    // if (chunk.type == 'finish') {
    //   controller.enqueue({ event: 'finish', id: Date.now().toString(), data: chunk});
    // }
  },
})

const eventTransform = new TransformStream<SSEvent, string>({
  transform:  async (chunk, controller) => {
    // controller.enqueue({ event: 'message', id: Date.now().toString(), data: chunk});
    // controller.enqueue(formatSSE(JSON.stringify(chunk.data), chunk.event))
  }
})

type GenerateOption = {
  files: string[],
  style?: string,
  prompt?: string
}

export class AIImageService {

    constructor(private fileService: FileService) {}

    async generateImage(option: GenerateOption) {
        // const imageUrl = await this.fileService.getFileURLById(data.fileKey)
        const model = await createModel()
        const prompt = option?.prompt ?? await createPrompt()
        const inputImages = option.files.slice(0,3).map(it => ({ type: "image" as const, image: it }))
        console.log('input-images',inputImages)
        console.log('prompt',prompt)
        const result = streamText({
            model: model,
            messages: [{
              role: 'user' as const,
              content: [
                ...inputImages,
                { type: "text", text: prompt },
              ]
            }],
            maxRetries: 3,
            maxTokens: 8192,
        })

      const res = result
        // .fullStream
        // .pipeThrough(aiEventTransform)
        // .pipeThrough(eventTransform)
      return res
    }

    async handleTextDelta(text: string) {
      console.log(text)
      if(imageRegex.test(text)) {
        // @ts-ignore
        const [,url] = imageRegex.exec(text)
        const res = await fetch(url).then(res=>res.bytes())
        const file = await this.fileService.uploadFile(res)
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
