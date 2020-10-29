import { container } from "tsyringe"
import { StatusCodes } from "http-status-codes"
import { Request, Response, NextFunction } from "express"
import { User, Host } from "../../../domain/entities"
import {
  SessionProvider,
  SessionProviderToken,
  SessionData,
} from "../../../domain/providers"

const sessionProvider = container.resolve<SessionProvider>(SessionProviderToken)

const getClient = async ({ clientId, sessionType }: SessionData) => {
  let user
  let host

  if (sessionType === "user") {
    user = await User.findOne({ id: clientId })
  } else if (sessionType === "host") {
    host = await Host.findOne({ id: clientId })
  }

  return { user, host }
}

export const authRequired = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (!request.headers.authorization) {
    return response.status(StatusCodes.UNAUTHORIZED).send()
  }

  const sessionData = await sessionProvider.validateToken(
    request.headers.authorization
  )

  if (!sessionData) {
    return response.status(StatusCodes.UNAUTHORIZED).send()
  }

  const { user, host } = await getClient(sessionData)

  if (!user && !host) {
    return response.status(StatusCodes.UNAUTHORIZED).send()
  }

  request.context = {
    ...request.context,
    user,
    host,
  }

  return next()
}
