import {BaseError} from "../errors/base";

export class NotImplementedError extends BaseError {
  constructor(name?: string) {
    super("NotImplementedError");
    this.message = name ? `${name} not implemented yet` : `not implemented yet`
  }
}