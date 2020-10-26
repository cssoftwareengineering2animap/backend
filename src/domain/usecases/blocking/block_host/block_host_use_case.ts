import { injectable } from "tsyringe"
import { Blocking } from "../../../entities/blocking_entity"
import { BlockHostDto } from "./block_host_dto"

@injectable()
export class BlockHostUseCase {
  execute = async ({ user, host }: BlockHostDto) =>
    Blocking.create({
      user,
      host: { id: host },
    }).save()
}
