import { IsEmail, MinLength } from "class-validator"
import { unique } from "../../../validators/unique"
import { Host } from "../../../entities/host_entity"
import { cpf } from "../../../validators/cpf"

export class CreateHostDto {
  constructor(props: CreateHostDto) {
    Object.assign(this, props)
  }

  @MinLength(4, { message: "O nome deve conter no mínimo 4 letras" })
  name: string

  @IsEmail({}, { message: "O email deve estar em um formato válido" })
  @unique(
    { field: "email", entity: Host },
    { message: "Esse email já está em uso" }
  )
  email: string

  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  password: string

  @cpf({ message: "O cpf deve ser válido" })
  @unique(
    { field: "cpf", entity: Host },
    { message: "Esse cpf já está em uso" }
  )
  cpf: string
}
