import {BaseError} from "./base";

export class NotImplementedError extends BaseError {
  constructor(name?: string) {
    super("NotImplementedError");
    this.message = name ? `${name} not implemented yet` : `not implemented yet`
  }
}

export class DBError extends BaseError {
  constructor(message?: string) {
    super(message);
  }
}