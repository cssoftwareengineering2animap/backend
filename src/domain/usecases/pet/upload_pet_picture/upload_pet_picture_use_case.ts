import { injectable } from "tsyringe"
import { getManager } from "typeorm"
import { ValidationError } from "../../../../core/errors"
import { ID } from "../../../../core/types/id"
import { File } from "../../../entities/file_entity"
import { Pet } from "../../../entities/pet_entity"
import { User } from "../../../entities/user_entity"
import { FileUploadDto } from "../../dtos/file_upload_dto"

@injectable()
export class UploadPetPictureUseCase {
  execute = (owner: User, petId: ID, data: FileUploadDto) =>
    getManager().transaction(async transactionalEntityManager => {
      const pet = await Pet.findOneOrFail({
        where: { id: petId, owner },
      })

      const pictures = await pet.pictures

      if (pictures.length >= 20) {
        throw new ValidationError([{ message: "Limite de fotos excedido" }])
      }

      const picture = File.create(data)

      await transactionalEntityManager.save(picture)

      await transactionalEntityManager
        .createQueryBuilder()
        .relation(Pet, "pictures")
        .of(pet)
        .add(picture)

      return picture
    })
}
