export const withErrorHandler = handler => async (request, response, next) => {
  try {
    return await handler(request, response)
  } catch (error) {
    return next(error)
  }
}
