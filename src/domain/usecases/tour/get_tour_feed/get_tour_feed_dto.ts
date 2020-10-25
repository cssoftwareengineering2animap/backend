import { IsNotEmpty } from "class-validator"
import { User } from "../../../entities/user_entity"

export class GetTourFeedDto {
  constructor(props: GetTourFeedDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O dono dos pets deve ser informado" })
  user: User
}
