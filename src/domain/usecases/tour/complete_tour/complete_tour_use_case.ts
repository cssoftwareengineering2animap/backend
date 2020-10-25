import { injectable } from "tsyringe"
import { ForbiddenError } from "../../../../core/errors/forbidden_error"
import { Tour, TourStatus } from "../../../entities/tour_entity"
import { CompleteTourDto } from "./complete_tour_dto"

@injectable()
export class CompleteTourUseCase {
  execute = async ({ user, tourId }: CompleteTourDto) => {
    const tour = await Tour.findOneOrFail(
      { id: tourId, status: TourStatus.pending },
      { relations: ["pet"] }
    )

    if (tour.pet.ownerId !== user.id) {
      throw new ForbiddenError("Pet pertence a outro usuário")
    }

    tour.status = TourStatus.completed

    await tour.save()

    return tour
  }
}
