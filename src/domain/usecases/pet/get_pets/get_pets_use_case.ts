import { injectable } from "tsyringe"
import { Pet } from "../../../entities/pet_entity"
import { edge } from "../../../../core/utils/edge"
import { GetPetsDto } from "./get_pets_dto"
import { User } from "../../../entities/user_entity"
import { ForbiddenError } from "../../../../core/errors/forbidden_error"

@injectable()
export class GetPetsUseCase {
  execute = async ({ user, userIdThatPetsBelongTo }: GetPetsDto) => {
    const userThatOwnsPets = await User.findOneOrFail(userIdThatPetsBelongTo)

    if (await userThatOwnsPets.isUserBlocked(user)) {
      throw new ForbiddenError()
    }

    const pets = await Pet.find({ where: { owner: userThatOwnsPets } })

    return pets.map(edge)
  }
}
