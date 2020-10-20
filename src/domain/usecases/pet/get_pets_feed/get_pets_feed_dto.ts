import { IsNotEmpty } from "class-validator"
import { Pagination } from "../../../../core/types/pagination"
import { User } from "../../../entities/user_entity"

export class GetPetsFeedDto {
  constructor(props: GetPetsFeedDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({
    message: "O usuário que está buscando por pets deve ser informado",
  })
  user: User

  @IsNotEmpty({ message: "Informe a paginação" })
  pagination: Pagination
}
