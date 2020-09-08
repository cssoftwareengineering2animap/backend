import { injectable, inject } from "tsyringe"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import { CreateUserUseCase } from "../../../../../domain/usecases/user/create_user/create_user_use_case"
import { CreateUserDto } from "../../../../../domain/usecases/user/create_user/create_user_dto"
import { envelope } from "../../../utils/envelope"
import { validateDto } from "../../../../../core/utils/validate_dto"

@injectable()
export class UserController {
  constructor(
    @inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  createUser = async (request: Request, response: Response) => {
    const dto = new CreateUserDto(request.body)

    await validateDto(dto)

    const user = await this.createUserUseCase.execute(dto)

    return response.status(StatusCodes.CREATED).json(envelope(user))
  }
}
