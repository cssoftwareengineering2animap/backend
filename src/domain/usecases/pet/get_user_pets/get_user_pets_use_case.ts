import { injectable } from "tsyringe"
import { Pet } from "../../../entities/pet_entity"
import { edge } from "../../../../core/utils/edge"
import { User } from "../../../entities/user_entity"

import { GetUserPetsDto } from "./get_user_pets_dto"

@injectable()
export class GetUserPetsUseCase {
  execute = async ({ userIdThatPetsBelongTo }: GetUserPetsDto) => {
    const userThatOwnsPets = await User.findOneOrFail(userIdThatPetsBelongTo)

    const pets = await Pet.find({ where: { owner: userThatOwnsPets } })

    return pets.map(edge)
  }
}
