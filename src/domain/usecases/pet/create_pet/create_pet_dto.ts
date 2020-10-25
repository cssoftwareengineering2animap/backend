import {
  IsNotEmpty,
  MinLength,
  IsIn,
  Min,
  Max,
  MaxLength,
} from "class-validator"

export class CreatePetDto {
  constructor(props: CreatePetDto) {
    Object.assign(this, props)
  }

  @MinLength(2, { message: "O nome do pet deve ter no mínimo 2 caracteres" })
  name: string

  @Min(0, { message: "A data de nascimento do pet deve ser mínimo 0" })
  @Max(100, { message: "A data de nascimento do pet deve ser máximo 100" })
  age: number

  @IsIn(["male", "female"], {
    message: "O sexo do animal deve ser macho ou fêmea",
  })
  sex: "male" | "female"

  @IsNotEmpty({ message: "O tipo de animal deve ser informado" })
  type: string

  @MaxLength(255, {
    message: "As observações podem conter no máximo 255 caracteres",
  })
  observations: string
}
