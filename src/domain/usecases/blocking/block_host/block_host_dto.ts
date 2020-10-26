import { IsNotEmpty } from "class-validator"
import { User } from "../../../entities/user_entity"
import { ID } from "../../../../core/types/id"

export class BlockHostDto {
  constructor(props: BlockHostDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O usuário que está bloqueando deve ser informado" })
  user: User

  @IsNotEmpty({
    message: "O anfitrião que vai ser bloqueado deve ser informado",
  })
  host: ID
}
