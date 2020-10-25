import { IsIn, IsNotEmpty } from "class-validator"
import { ID } from "../../../../core/types/id"
import { Host } from "../../../entities/host_entity"
import { TourStatus } from "../../../entities/tour_entity"
import { isFutureDate } from "../../../validators/is_future_date"

export class CreateTourDto {
  constructor(props: CreateTourDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({ message: "O pet deve ser informado" })
  petId: ID

  @IsNotEmpty({ message: "O anfitrião deve ser informado" })
  host: Host

  @IsIn(Object.values(TourStatus), {
    message: `O status deve ser um dos ${Object.values(TourStatus).join(", ")}`,
  })
  status: TourStatus

  @isFutureDate({
    message:
      "Não é possível agendar passeios para datas anteriores ao dia de hoje",
  })
  scheduledFor: Date
}
