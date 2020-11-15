import { injectable } from "tsyringe"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { validateDto } from "../../../../../../core/utils"
import { TourStatus } from "../../../../../../domain/entities"
import {
  CreateTourDto,
  CreateTourUseCase,
  DenyTourUseCase,
  AcceptTourUseCase,
  CompleteTourUseCase,
  GetTourFeedUseCase,
  DenyTourDto,
  AcceptTourDto,
  CompleteTourDto,
  GetTourFeedDto,
} from "../../../../../../domain/usecases"
import { envelope } from "../../../../utils"

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
    const dto = new GetTourFeedDto({
      user: request.context.user,
      status: request.query.status as TourStatus,
    })

    await validateDto(dto)

    const tours = await this.getTourFeedUseCase.execute(dto)

    return response.json(envelope(tours))
  }
}
