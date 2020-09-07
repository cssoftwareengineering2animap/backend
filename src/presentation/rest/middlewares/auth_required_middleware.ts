import { Request, Response, NextFunction } from "express"
import { container } from "tsyringe"
import { StatusCodes } from "http-status-codes"
import { SessionProvider } from "../../../domain/providers/session_provider"
import { User } from "../../../domain/entities/user_entity"

export const authRequired = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.headers.authorization) {
    return response.status(StatusCodes.UNAUTHORIZED).send()
  }

  const sessionProvider = container.resolve<SessionProvider>("SessionProvider")

  const sessionData = await sessionProvider.validateToken(
    request.headers.authorization
  )

  if (!sessionData) {
    return response.status(StatusCodes.UNAUTHORIZED).send()
  }

  const user = await User.findOne({ id: sessionData.user_id })

  if (!user) {
    return response.status(StatusCodes.UNAUTHORIZED).send()
  }

  request.context = {
    ...request.context,
    user,
  }

  return next()
}
