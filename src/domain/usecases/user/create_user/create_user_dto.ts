import { IsNotEmpty, IsEmail, IsMobilePhone } from "class-validator"

export class CreateUserDto {
  constructor(props: CreateUserDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O nome deve ser informado" })
  nome: string

  @IsNotEmpty({ message: "O email deve ser informado" })
  @IsEmail({}, { message: "O email deve estar em um formato válido" })
  email: string

  @IsNotEmpty({ message: "O email deve ser informado" })
  @IsMobilePhone("pt-BR")
  phone: string
}
