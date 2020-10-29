import { injectable } from "tsyringe"
import { ForbiddenError } from "../../../../core/errors"
import { Tour, TourStatus } from "../../../entities/tour_entity"
import { AcceptTourDto } from "./accept_tour_dto"

@injectable()
export class AcceptTourUseCase {
  execute = async ({ user, tourId }: AcceptTourDto) => {
    const tour = await Tour.findOneOrFail(
      { id: tourId, status: TourStatus.pending },
      { relations: ["pet"] }
    )

    if (tour.pet.ownerId !== user.id) {
      throw new ForbiddenError("Pet pertence a outro usuário")
    }

    tour.status = TourStatus.accepted

    await tour.save()

    return tour
  }
}
