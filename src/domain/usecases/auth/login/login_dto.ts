import { IsNotEmpty } from "class-validator"

export class LoginDto {
  constructor(props: LoginDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O email deve ser informado" })
  email: string

  @IsNotEmpty({ message: "A senha deve ser informada" })
  password: string
}
