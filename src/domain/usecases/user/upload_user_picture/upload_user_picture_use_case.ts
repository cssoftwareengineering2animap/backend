import { injectable } from "tsyringe"
import { getManager } from "typeorm"
import { File } from "../../../entities/file_entity"
import { User } from "../../../entities/user_entity"
import { UploadUserPictureDto } from "./upload_user_picture_dto"

@injectable()
export class UploadUserPictureUseCase {
  execute = (user: User, data: UploadUserPictureDto) =>
    getManager().transaction(async transactionalEntityManager => {
      const profilePicture = File.create(data)

      await transactionalEntityManager.save(profilePicture)

      // eslint-disable-next-line no-param-reassign
      user.pictures.push(profilePicture)

      await transactionalEntityManager.save(user)

      console.log("aaaaa", profilePicture)
      return profilePicture
    })
}
