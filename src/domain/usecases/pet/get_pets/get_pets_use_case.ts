import { injectable } from "tsyringe"
import { ID } from "../../../../core/types/id"
import { Pet } from "../../../entities/pet_entity"
import { edge } from "../../../edge"

@injectable()
export class GetPetsUseCase {
  execute = async (userId: ID) => {
    const pets = await Pet.find({ where: { owner: userId } })

    return pets.map(edge)
  }
}
