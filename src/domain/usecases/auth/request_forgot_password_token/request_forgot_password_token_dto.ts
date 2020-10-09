import { IsNotEmpty } from "class-validator"

export class RequestForgotPasswordTokenDto {
  constructor(props: RequestForgotPasswordTokenDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O email deve ser informado" })
  email: string
}
