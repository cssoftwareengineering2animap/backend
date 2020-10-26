import { inject, injectable } from "tsyringe"

import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { CreateHostDto } from "../../../../../domain/usecases/host/create_host/create_host_dto"
import { validateDto } from "../../../../../core/utils/validate_dto"
import { envelope } from "../../../utils/envelope"
import { CreateHostUseCase } from "../../../../../domain/usecases/host/create_host/create_host_use_case"
import { BlockHostDto } from "../../../../../domain/usecases/blocking/block_host/block_host_dto"
import { BlockHostUseCase } from "../../../../../domain/usecases/blocking/block_host/block_host_use_case"

@injectable()
export class HostController {
  constructor(
    @inject(CreateHostUseCase)
    private readonly createHostUseCase: CreateHostUseCase,
    @inject(BlockHostUseCase)
    private readonly blockHostUseCase: BlockHostUseCase
  ) {}

  createHost = async (request: Request, response: Response) => {
    const dto = new CreateHostDto(request.body)

    await validateDto(dto)

    const user = await this.createHostUseCase.execute(dto)

    return response.status(StatusCodes.CREATED).json(envelope(user))
  }

  blockHost = async (request: Request, response: Response) => {
    const dto = new BlockHostDto({
      user: request.context.user,
      host: request.params.hostId,
    })

    await validateDto(dto)

    await this.blockHostUseCase.execute(dto)

    return response.status(StatusCodes.OK).send()
  }
}
