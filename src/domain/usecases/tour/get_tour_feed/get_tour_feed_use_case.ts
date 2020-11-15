import { injectable } from "tsyringe"

import { Tour } from "../../../entities/tour_entity"
import { GetTourFeedDto } from "./get_tour_feed_dto"

@injectable()
export class GetTourFeedUseCase {
  execute = async ({ user, status }: GetTourFeedDto) => {
    const query = Tour.createQueryBuilder("tour")
      .innerJoinAndSelect("tour.host", "host")
      .innerJoinAndSelect("tour.pet", "pet")
      .where("pet.ownerId = :userId", {
        userId: user.id,
      })

    if (status) {
      query.where("tour.status = :status", { status })
    }

    return query.getMany()
  }
}
