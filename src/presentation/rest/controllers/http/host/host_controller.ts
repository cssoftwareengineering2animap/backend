import { inject, injectable } from "tsyringe"

import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { CreateHostDto } from "../../../../../domain/usecases/host/create_host/create_host_dto"
import { validateDto } from "../../../../../core/utils/validate_dto"
import { envelope } from "../../../utils/envelope"
import { CreateHostUseCase } from "../../../../../domain/usecases/host/create_host/create_host_use_case"

@injectable()
export class HostController {
  constructor(
    @inject(CreateHostUseCase)
    private readonly createHostUseCase: CreateHostUseCase
  ) {}

  createHost = async (request: Request, response: Response) => {
    const dto = new CreateHostDto(request.body)

    await validateDto(dto)

    const user = await this.createHostUseCase.execute(dto)

    return response.status(StatusCodes.CREATED).json(envelope(user))
  }
}
