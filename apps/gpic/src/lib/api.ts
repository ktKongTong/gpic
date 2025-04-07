import {ofetch} from "ofetch";
import {Task} from "./type";

const fetchIns = ofetch.create({
  onResponseError: (ctx) => {
    ctx.error
  },
  retry: false,

});

type TaskCreate = {
  files: string[],
  style: string[],
  prompt?: string,
  times?: number,
  batch?: boolean
}

class API {

  constructor() {}

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