export class BizError extends Error {
  constructor(message: string, public code: number) {
    super(message)
  }
}
export class UnauthorizedError extends BizError {
  constructor(message?: string) {
    super(message??'Unauthorized', 401)
  }
}

export class NotFoundError extends BizError {
  constructor() {
    super('Not Found', 404)
  }
}



export class ParameterError extends BizError {
  constructor(message?: string) {
    super(message??'Parameter Error', 400)
  }
}

export class RateLimitError extends BizError {
  constructor(message?: string) {
    super(message??'RateLimitError', 429)
  }
}

// 缓存
// 用户，计费系统
// 本地。history，taskId。
//  1.stream，2. 查历史。
// style，重试次数，失败。
// 本地
// cloudflare worker queue
// 1. add task_id, 更新进度
// 2. 重试。