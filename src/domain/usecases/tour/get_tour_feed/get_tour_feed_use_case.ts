import { injectable } from "tsyringe"

import { Tour } from "../../../entities/tour_entity"
import { GetTourFeedDto } from "./get_tour_feed_dto"

@injectable()
export class GetTourFeedUseCase {
  execute = async ({ user }: GetTourFeedDto) => {
    /*
      Host
        picture
        name
        tour count
      Pet
        name
      tip
      status
      scheduledAt
    */
    const tours = await Tour.createQueryBuilder("tour")
      .innerJoinAndSelect("tour.host", "host")
      .innerJoinAndSelect("tour.pet", "pet")
      .where("pet.ownerId = :userId", {
        userId: user.id,
      })

      .getMany()

    return tours
  }
}
