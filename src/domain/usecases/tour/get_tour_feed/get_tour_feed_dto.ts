import { IsIn, IsNotEmpty, IsOptional } from "class-validator"
import { TourStatus } from "../../../entities"
import { User } from "../../../entities/user_entity"

export class GetTourFeedDto {
  constructor(props: GetTourFeedDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O dono dos pets deve ser informado" })
  user: User

  @IsOptional()
  @IsIn(Object.values(TourStatus))
  status?: TourStatus
}
