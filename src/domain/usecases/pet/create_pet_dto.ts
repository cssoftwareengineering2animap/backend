import { IsNotEmpty, MinLength, IsISO8601, IsIn } from "class-validator"

export class CreatePetDto {
  constructor(props: CreatePetDto) {
    Object.assign(this, props)
  }

  @MinLength(2, { message: "O nome do pet deve ter no mínimo 2 caracteres" })
  name: string

  @IsISO8601(
    { strict: false },
    {
      message:
        "A data de nascimento do pet deve ser informada no formato AAAA-MM-DD",
    }
  )
  birthday: string

  @IsIn(["male", "female"], {
    message: "O sexo do animal deve ser macho ou fêmea",
  })
  sex: "male" | "female"

  @IsNotEmpty({ message: "O tipo de animal deve ser informado" })
  type: string
}
