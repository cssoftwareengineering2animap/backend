import { injectable, inject } from "tsyringe"
import { validateOrReject } from "class-validator"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import { CreateUserUseCase } from "../../../../domain/usecases/user/create_user/create_user_use_case"
import { CreateUserDto } from "../../../../domain/usecases/user/create_user/create_user_dto"
import { envelope } from "../../utils/envelope"

@injectable()
export class UserController {
  constructor(
    @inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  createUser = (request: Request, response: Response) => {
    const dto = new CreateUserDto(request.body)

    return validateOrReject(dto)
      .then(() => this.createUserUseCase.execute(dto))
      .then(user => response.status(StatusCodes.CREATED).json(envelope(user)))
      .catch(errors => response.status(StatusCodes.BAD_REQUEST).json(errors))
  }
}
