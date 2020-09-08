import { injectable } from "tsyringe"
import { User } from "../../../entities/user_entity"

@injectable()
export class JoinChatUseCase {
  execute = async (user: User) => {}
}
