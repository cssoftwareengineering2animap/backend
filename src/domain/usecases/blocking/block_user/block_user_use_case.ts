import { injectable } from "tsyringe"
import { Blocking } from "../../../entities/blocking_entity"
import { BlockUserDto } from "./block_user_dto"

@injectable()
export class BlockUserUseCase {
  execute = async ({ user, host }: BlockUserDto) =>
    Blocking.create({
      host,
      user: { id: user },
    }).save()
}
