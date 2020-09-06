import { validateOrReject } from "class-validator"
import { ValidationError } from "../errors/validation_error"

export const validateDto = async <T>(dto: T) => {
  try {
    await validateOrReject(dto)
  } catch (errors) {
    throw new ValidationError(
      errors.flatMap(error =>
        Object.values(error.constraints).map(message => ({ message }))
      )
    )
  }
}
