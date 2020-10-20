import { Request, Response, NextFunction } from "express"

export const clampPagination = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  const page = request.query.page ? Number(request.query.page) : 0

  const limit = Number(
    request.query.limit && Number(request.query.limit) > 100
      ? 100
      : request.query.limit || 20
  )

  request.context = {
    ...request.context,
    pagination: {
      page,
      limit,
    },
  }

  return next()
}
