import {BaseError} from "./base";

export class BizError extends BaseError {
  constructor(message: string, public code: number) {
    super(message)
  }
}
export class UnauthorizedError extends BizError {
  constructor(message?: string) {
    super(message??'Unauthorized', 401)
  }
}


export class AccessDeniedError extends BizError {
  constructor(message?: string) {
    super(message??'AccessDenied', 401)
  }
}

export class NotFoundError extends BizError {
  constructor(message?: string) {
    super(message ?? 'Not Found', 404)
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