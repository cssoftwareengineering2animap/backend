import { injectable } from "tsyringe"
import { Tour } from "../../../entities/tour_entity"
import { CreateTourDto } from "./create_tour_dto"

@injectable()
export class CreateTourUseCase {
  execute = (data: CreateTourDto) => Tour.create(data).save()
}
