import { injectable } from "tsyringe"
import { getManager } from "typeorm"
import { ValidationError } from "../../../../core/errors"
import { File } from "../../../entities/file_entity"
import { User } from "../../../entities/user_entity"
import { FileUploadDto } from "../../dtos/file_upload_dto"

@injectable()
export class UploadUserPictureUseCase {
  execute = (user: User, data: FileUploadDto) =>
    getManager().transaction(async transactionalEntityManager => {
      const userPictures = await user.pictures

      if (userPictures.length >= 20) {
        throw new ValidationError([{ message: "Limite de fotos excedido" }])
      }

      const picture = File.create(data)

      await transactionalEntityManager.save(picture)

      await transactionalEntityManager
        .createQueryBuilder()
        .relation(User, "pictures")
        .of(user)
        .add(picture)

      return picture
    })
}
