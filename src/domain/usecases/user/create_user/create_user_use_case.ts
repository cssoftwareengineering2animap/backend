import { injectable, inject } from "tsyringe"
import { CreateUserDto } from "./create_user_dto"
import { User } from "../../../entities/user_entity"
import { EncryptionProvider } from "../../../providers/encryption_provider"

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("EncryptionProvider")
    private readonly encryptionProvider: EncryptionProvider
  ) {}

  execute = async (data: CreateUserDto) => {
    const user = User.create(data)

    user.password = await this.encryptionProvider.hash(data.password)

    await user.save()

    user.password = undefined

    return user
  }
}
