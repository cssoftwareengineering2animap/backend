import { IsNotEmpty } from "class-validator"

export class ResetPasswordWithForgotPasswordTokenDto {
  constructor(props: ResetPasswordWithForgotPasswordTokenDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O token de recuperação de senha deve ser informado" })
  token: string

  @IsNotEmpty({ message: "A nova senha deve ser informada" })
  password: string
}
