import { injectable } from "tsyringe"
import { Pet } from "../../../entities/pet_entity"
import { edge } from "../../../../core/utils/edge"
import { User } from "../../../entities/user_entity"
import { ForbiddenError } from "../../../../core/errors/forbidden_error"
import { GetUserPetsDto } from "./get_user_pets_dto"

@injectable()
export class GetUserPetsUseCase {
  execute = async ({ user, userIdThatPetsBelongTo }: GetUserPetsDto) => {
    const userThatOwnsPets = await User.findOneOrFail(userIdThatPetsBelongTo)

    if (await userThatOwnsPets.isUserBlocked(user)) {
      throw new ForbiddenError()
    }

    const pets = await Pet.find({ where: { owner: userThatOwnsPets } })

    return pets.map(edge)
  }
}
