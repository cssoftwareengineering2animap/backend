import { IsNotEmpty, IsEmail, MinLength, MaxLength } from "class-validator"
import { unique } from "../../../validators/unique"
import { User } from "../../../entities/user_entity"

export class CreateUserDto {
  constructor(props: CreateUserDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O nome deve ser informado" })
  name: string

  @IsEmail({}, { message: "O email deve estar em um formato válido" })
  @unique(
    { field: "email", entity: User },
    { message: "Esse email já está em uso" }
  )
  email: string

  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  password: string

  @MinLength(10, { message: "O telefone deve ter no mínimo 10 dígitos" })
  @MaxLength(11, { message: "O telefone deve ter no máximo 11 dígitos" })
  @unique(
    { field: "phone", entity: User },
    { message: "Esse telefone já está em uso" }
  )
  phone: string
}
