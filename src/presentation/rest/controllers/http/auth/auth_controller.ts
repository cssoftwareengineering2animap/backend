import { injectable, inject } from "tsyringe"
import { Request, Response } from "express"
import {
  LoginDto,
  LoginUseCase,
  RequestForgotPasswordTokenDto,
  RequestForgotPasswordTokenUseCase,
  ResetPasswordWithForgotPasswordTokenDto,
  ResetPasswordWithForgotPasswordTokenUseCase,
} from "../../../../../domain/usecases"
import { envelope } from "../../../utils"
import { validateDto } from "../../../../../core/utils"

@injectable()
export class AuthController {
  constructor(
    @inject(LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
    @inject(RequestForgotPasswordTokenUseCase)
    private readonly forgotPasswordUseCase: RequestForgotPasswordTokenUseCase,
    @inject(ResetPasswordWithForgotPasswordTokenUseCase)
    private readonly resetPasswordWithForgotPasswordTokenUseCase: ResetPasswordWithForgotPasswordTokenUseCase
  ) {}

  login = async (request: Request, response: Response) => {
    const dto = new LoginDto(request.body)

    await validateDto(dto)

    const token = await this.loginUseCase.execute(dto)

    return response.json(envelope({ token }))
  }

  requestForgotPasswordToken = async (request: Request, response: Response) => {
    const dto = new RequestForgotPasswordTokenDto({ email: request.body.email })

    await validateDto(dto)

    const token = await this.forgotPasswordUseCase.execute(dto)

    return response.json(envelope({ token }))
  }

  resetPasswordWithForgotPasswordToken = async (
    request: Request,
    response: Response
  ) => {
    const dto = new ResetPasswordWithForgotPasswordTokenDto({
      password: request.body.password,
      token: request.body.token,
    })

    await validateDto(dto)

    await this.resetPasswordWithForgotPasswordTokenUseCase.execute(dto)

    return response.send()
  }
}
