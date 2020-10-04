import { injectable } from "tsyringe"
import { UserBlocking } from "../../../entities/user_blocking_entity"
import { BlockUserDto } from "./block_user_dto"

@injectable()
export class BlockUserUseCase {
  execute = ({ user, userThatWillBeBlockedId }: BlockUserDto) =>
    UserBlocking.create({
      blocker: user,
      blocked: { id: userThatWillBeBlockedId },
    }).save()
}
