import { injectable } from "tsyringe"
import { Entity } from "typeorm"
import { CreateUserDto } from "./create_user_dto"
import { User } from "../../../entities/user_entity"

@injectable()
export class CreateUserUseCase {
  execute = (data: CreateUserDto) => User.create(data)
}
