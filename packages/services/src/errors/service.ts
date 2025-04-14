import {BaseError} from "./base";

export class ServiceError extends BaseError {
  constructor(message?: string) {
    super(message);
  }
}