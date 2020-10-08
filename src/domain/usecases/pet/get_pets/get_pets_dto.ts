import { IsNotEmpty } from "class-validator"
import { User } from "../../../entities/user_entity"
import { ID } from "../../../../core/types/id"

export class GetPetsDto {
  constructor(props: GetPetsDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({
    message: "O usuário que está buscando por pets deve ser informado",
  })
  user: User

  @IsNotEmpty({ message: "O usuário que é dono dos pets deve ser informado" })
  userIdThatPetsBelongTo: ID
}
