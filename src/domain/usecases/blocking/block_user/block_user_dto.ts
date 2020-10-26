import { IsNotEmpty } from "class-validator"
import { ID } from "../../../../core/types/id"
import { Host } from "../../../entities/host_entity"

export class BlockUserDto {
  constructor(props: BlockUserDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O anfitrião que está bloqueando deve ser informado" })
  host: Host

  @IsNotEmpty({
    message: "O usuário que vai ser bloqueado deve ser informado",
  })
  user: ID
}
