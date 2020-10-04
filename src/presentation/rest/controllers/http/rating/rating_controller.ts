import { inject, injectable } from "tsyringe"

import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { RateUserDto } from "../../../../../domain/usecases/user/rate_user/rate_user.dto"
import { validateDto } from "../../../../../core/utils/validate_dto"
import { RateUserUseCase } from "../../../../../domain/usecases/user/rate_user/rate_user_use_case"
import { envelope } from "../../../utils/envelope"

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
