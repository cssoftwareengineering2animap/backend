import { injectable } from "tsyringe"
import { Not } from "typeorm"
import { Pet } from "../../../entities/pet_entity"
import { GetPetsFeedDto } from "./get_pets_feed_dto"

@injectable()
export class GetPetsFeedUseCase {
  execute = ({ user, pagination }: GetPetsFeedDto) =>
    Pet.find({
      relations: ["pictures"],
      where: { ownerId: Not(user.id) },
      skip: pagination.page * pagination.limit,
      take: pagination.limit,
    })
}
