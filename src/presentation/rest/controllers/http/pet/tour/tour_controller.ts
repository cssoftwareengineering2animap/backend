import { injectable } from "tsyringe"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { CreateTourDto } from "../../../../../../domain/usecases/tour/create_tour/create_tour_dto"
import { TourStatus } from "../../../../../../domain/entities/tour_entity"
import { CreateTourUseCase } from "../../../../../../domain/usecases/tour/create_tour/create_tour_use_case"
import { validateDto } from "../../../../../../core/utils/validate_dto"
import { envelope } from "../../../../utils/envelope"
import { DenyTourUseCase } from "../../../../../../domain/usecases/tour/deny_tour/deny_tour_use_case"
import { AcceptTourUseCase } from "../../../../../../domain/usecases/tour/accept_tour/accept_tour_use_case"
import { CompleteTourUseCase } from "../../../../../../domain/usecases/tour/complete_tour/complete_tour_use_case"
import { DenyTourDto } from "../../../../../../domain/usecases/tour/deny_tour/deny_tour_dto"
import { AcceptTourDto } from "../../../../../../domain/usecases/tour/accept_tour/accept_tour_dto"
import { CompleteTourDto } from "../../../../../../domain/usecases/tour/complete_tour/complete_tour_dto"
import { GetTourFeedDto } from "../../../../../../domain/usecases/tour/get_tour_feed/get_tour_feed_dto"
import { GetTourFeedUseCase } from "../../../../../../domain/usecases/tour/get_tour_feed/get_tour_feed_use_case"

@injectable()
export class TourController {
  constructor(
    private readonly createTourUseCase: CreateTourUseCase,
    private readonly denyTourUseCase: DenyTourUseCase,
    private readonly acceptTourUseCase: AcceptTourUseCase,
    private readonly completeTourUseCase: CompleteTourUseCase,
    private readonly getTourFeedUseCase: GetTourFeedUseCase
  ) {}

  createTour = async (request: Request, response: Response) => {
    const dto = new CreateTourDto({
      host: request.context.host,
      petId: request.params.petId,
      scheduledFor: request.body.scheduledFor,
      status: TourStatus.pending,
      tip: Number(request.body.tip),
    })

    await validateDto(dto)

    const tour = await this.createTourUseCase.execute(dto)

    return response.status(StatusCodes.CREATED).json(envelope(tour))
  }

  denyTour = async (request: Request, response: Response) => {
    const dto = new DenyTourDto({
      user: request.context.user,
      tourId: request.params.tourId,
    })

    await validateDto(dto)

    const tour = await this.denyTourUseCase.execute(dto)

    return response.json(envelope(tour))
  }

  acceptTour = async (request: Request, response: Response) => {
    const dto = new AcceptTourDto({
      user: request.context.user,
      tourId: request.params.tourId,
    })

    await validateDto(dto)

    const tour = await this.acceptTourUseCase.execute(dto)

    return response.json(envelope(tour))
  }

  completeTour = async (request: Request, response: Response) => {
    const dto = new CompleteTourDto({
      user: request.context.user,
      tourId: request.params.tourId,
    })

    await validateDto(dto)

    const tour = await this.completeTourUseCase.execute(dto)

    return response.json(envelope(tour))
  }

  getTours = async (request: Request, response: Response) => {
    const dto = new GetTourFeedDto({ user: request.context.user })

    await validateDto(dto)

    const tours = await this.getTourFeedUseCase.execute(dto)

    return response.json(envelope(tours))
  }
}
