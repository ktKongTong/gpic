import {ofetch} from "ofetch";
import {Task} from "./type";
export class ReqError extends Error {
  constructor(message: string) {
    super(message);
  }
}
const fetchIns = ofetch.create({
  onResponseError: async (ctx) => {
    const data =await ctx.response._data
    // @ts-ignore
    console.error("ctx", data?.error);
    // @ts-ignore
    throw new ReqError(data?.error);
  },
  retry: false,
});

type TaskCreate = {
  files: string[],
  times?: number,
  batch?: boolean
}

type StyleInput = {
  styleId: string,
} | {
  reference: string[],
  prompt: string
}

type TaskCreateV2 = {
  files: string[],
  styles: StyleInput[]
  count?: number,
  size?: 'auto' |'1x1'| '3x2' | '2x3',
  batch?: boolean
}

type PresetStyle = {
  id: string,
  styleId: string,
  version: number,
  i18n: string,
  name: string,
  aliases: string[],
  examples: string[],
  prompt: string,
  reference: string[],
}
type Style = {
  prompt: string
  reference: string
} | { styleId: string }

// preset style, or custom style

class API {

  constructor() {}

  getStyles() {
    return fetchIns<PresetStyle[]>('/api/style')
  }

  getTasks() {
    return fetchIns<Task[]>('/api/task')
  }

  getTaskById(id: string) {
    return fetchIns<Task>(`/api/task/${id}`)
  }

  createTask(input: TaskCreate) {
    return fetchIns<Task>(`/api/task/image/flavor-image`, {
      method: 'POST',
      body: input
    })
  }
  createTaskV2(input: TaskCreateV2) {
    return fetchIns<Task>(`/api/v2/task/image/flavor-image`, {
      method: 'POST',
      body: {
        version: '1',
        ...input,
      }
    })
  }

  retryTask(id: string) {
    return fetchIns<Task>(`/api/task/${id}/retry`, {
      method: 'PATCH',
    })
  }

  uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return fetchIns<{url: string}>('/api/file/upload', {
      method: 'PUT',
      body: formData
    })
  }

  getBalance() {
    return fetchIns<{balance: number}>('/api/balance', {
      method: 'GET',
    })
  }


  createRechargeOrder(priceId: string) {
    return fetchIns<{
      id: string,
      msg?: string,
      taskId?: string,
      amount: number,
      createdAt: string,
      status: string,
      paddlePriceId?: string
      updatedAt: string,
    }>(`/api/order`, {
      method: 'POST',
      body: {priceId}
    })
  }

  getOrders() {
    return fetchIns<{
      id: string,
      msg?: string,
      taskId?: string,
      amount: number,
      createdAt: string,
      status: string,
      paddlePriceId?: string
      updatedAt: string,
    }[]>('/api/order', {
      method: 'GET',
    })
  }
  getGallery() {
    return fetchIns<{id: string|number, url: string}[]>('/api/gallery', {
      method: 'GET',
    })
  }

  getPrices() {
    const price = fetchIns<{id: string, paddleId: string, credits: number, price: string, description: string}[]>('/api/price', {
      method: 'GET'
    })
    return price
  }

  redeemCode(code: string) {
    return fetchIns<{id: string|number, url: string}[]>('/api/redeem', {
      method: 'POST',
      body: {
        code
      }
    })
  }

  batchUpload(files: File[]) {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('file', file)
    })
    return fetchIns('/api/file/upload', {
      method: 'PUT',
      body: formData
    })
  }
}



export const api = new API()