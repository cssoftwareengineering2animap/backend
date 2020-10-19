import { injectable } from "tsyringe"
import { Host } from "../../../entities/host_entity"

import { CreateHostDto } from "./create_host_dto"

@injectable()
export class CreateHostUseCase {
  execute = async (data: CreateHostDto) => {
    const host = Host.create(data)

    await host.save()

    host.password = undefined

    return host
  }
}
