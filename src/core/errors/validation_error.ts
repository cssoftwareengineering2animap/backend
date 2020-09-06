import { ApplicationError } from "./application_error"

export class ValidationError extends ApplicationError {
  constructor(public readonly errors: { message: string }[]) {
    super()
  }
}
