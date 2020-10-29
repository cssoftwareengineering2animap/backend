import { injectable } from "tsyringe"
import { ForbiddenError } from "../../../../core/errors"
import { Tour, TourStatus } from "../../../entities/tour_entity"
import { DenyTourDto } from "./deny_tour_dto"

@injectable()
export class DenyTourUseCase {
  execute = async ({ user, tourId }: DenyTourDto) => {
    const tour = await Tour.findOneOrFail(
      { id: tourId, status: TourStatus.pending },
      { relations: ["pet"] }
    )

    if (tour.pet.ownerId !== user.id) {
      throw new ForbiddenError("Pet pertence a outro usuário")
    }

    tour.status = TourStatus.denied

    await tour.save()

    return tour
  }
}
