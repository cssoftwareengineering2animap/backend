import { injectable, inject } from "tsyringe"
import { Request, Response } from "express"
import { envelope } from "../../utils/envelope"
import { LoginUseCase } from "../../../../domain/usecases/auth/login/login_use_case"
import { LoginDto } from "../../../../domain/usecases/auth/login/login_dto"
import { validateDto } from "../../../../core/utils/validate_dto"

@injectable()
export class AuthController {
  constructor(
    @inject(LoginUseCase)
    private readonly loginUseCase: LoginUseCase
  ) {}

  login = async (request: Request, response: Response) => {
    const dto = new LoginDto(request.body)

    await validateDto(dto)

    const token = await this.loginUseCase.execute(dto)

    return response.json(envelope({ token }))
  }
}
