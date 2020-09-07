import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"
import { ApplicationError } from "../../../core/errors/application_error"
import { ValidationError } from "../../../core/errors/validation_error"
import { UnauthorizedError } from "../../../core/errors/unauthorized_error"

export const globalErrorHandler = (
  error: unknown,
  _request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (error instanceof UnauthorizedError) {
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .json([{ message: error.message }])
  }

  if (error instanceof ValidationError) {
    return response.status(StatusCodes.BAD_REQUEST).json(error.errors)
  }
  if (error instanceof ApplicationError) {
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json([{ message: error.message }])
  }

  return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
}
