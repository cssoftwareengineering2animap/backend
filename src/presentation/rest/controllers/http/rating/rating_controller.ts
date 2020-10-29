import { inject, injectable } from "tsyringe"

import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { RateUserDto, RateUserUseCase } from "../../../../../domain/usecases"
import { validateDto } from "../../../../../core/utils"
import { envelope } from "../../../utils"

@injectable()
export class RatingController {
  constructor(
    @inject(RateUserUseCase)
    private readonly rateUserUseCase: RateUserUseCase
  ) {}

  rateUser = async (request: Request, response: Response) => {
    const dto = new RateUserDto({
      user: request.params.userId,
      grader: request.context.user,
      stars: request.body.stars,
    })

    await validateDto(dto)

    const rating = await this.rateUserUseCase.execute(dto)

    return response.status(StatusCodes.CREATED).json(envelope(rating))
  }
}
