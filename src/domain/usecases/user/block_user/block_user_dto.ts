import { IsNotEmpty } from "class-validator"
import { User } from "../../../entities/user_entity"
import { ID } from "../../../../core/types/id"

export class BlockUserDto {
  constructor(props: BlockUserDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O usuário que está bloqueando deve ser informado" })
  user: User

  @IsNotEmpty({ message: "O usuário que vai ser bloqueado deve ser informado" })
  userThatWillBeBlockedId: ID
}
