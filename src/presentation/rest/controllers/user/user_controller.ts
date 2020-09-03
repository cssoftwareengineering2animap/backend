import { injectable, inject } from "tsyringe"
import { validateOrReject } from "class-validator"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import { CreateUserUseCase } from "../../../../domain/usecases/user/create_user/create_user_use_case"
import { CreateUserDto } from "../../../../domain/usecases/user/create_user/create_user_dto"

@injectable()
export class UserController {
  constructor(
    @inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  createUser = (request: Request, response: Response) => {
    const dto = new CreateUserDto(request.body)

    validateOrReject(dto)
      .then(() => this.createUserUseCase.execute(dto))
      .catch(errors => response.status(StatusCodes.BAD_REQUEST).json(errors))
  }
}
