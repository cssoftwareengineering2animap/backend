import { IsNotEmpty, IsEmail, MinLength } from "class-validator"
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
}
