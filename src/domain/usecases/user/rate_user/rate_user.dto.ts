import { IsNotEmpty, Max, Min } from "class-validator"
import { ID } from "../../../../core/types/id"
import { User } from "../../../entities/user_entity"

export class RateUserDto {
  constructor(props: RateUserDto) {
    Object.assign(this, props)
  }

  @Min(0, { message: "O mínimo de estrelas é 0" })
  @Max(5, { message: "O máximo de estrelas é 5" })
  stars: number

  @IsNotEmpty({
    message: "O usuário que está sendo avaliado deve ser informado",
  })
  user: ID

  @IsNotEmpty({ message: "O usuário que está avaliando deve ser informado" })
  grader: User
}
