import { IsNotEmpty } from "class-validator"
import { ID } from "../../../../core/types/id"
import { User } from "../../../entities/user_entity"

export class CompleteTourDto {
  constructor(props: CompleteTourDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O passeio deve ser informado" })
  tourId: ID

  @IsNotEmpty({ message: "O dono do pet deve ser informado" })
  user: User
}
