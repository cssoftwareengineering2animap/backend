import { injectable } from "tsyringe"
import { Pet } from "../../../entities/pet_entity"
import { edge } from "../../../../core/utils/edge"
import { ID } from "../../../../core/types/id"

@injectable()
export class GetPetsUseCase {
  execute = async (userId: ID) => {
    const pets = await Pet.find({ where: { owner: { id: userId } } })

    return pets.map(edge)
  }
}
