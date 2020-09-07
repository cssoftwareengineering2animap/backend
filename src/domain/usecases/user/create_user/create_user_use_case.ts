import { injectable } from "tsyringe"
import { CreateUserDto } from "./create_user_dto"
import { User } from "../../../entities/user_entity"

@injectable()
export class CreateUserUseCase {
  execute = async (data: CreateUserDto) => {
    const user = User.create(data)

    await user.save()

    user.password = undefined

    return user
  }
}
