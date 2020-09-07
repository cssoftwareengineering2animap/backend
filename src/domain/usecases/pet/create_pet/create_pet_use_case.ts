import { injectable } from "tsyringe"
import { CreatePetDto } from "./create_pet_dto"
import { User } from "../../../entities/user_entity"
import { Pet } from "../../../entities/pet_entity"

@injectable()
export class CreatePetUseCase {
  execute = async (user: User, data: CreatePetDto) => {
    const pet = Pet.create(data)

    pet.owner = user

    await pet.save()

    return pet
  }
}
