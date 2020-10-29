import { injectable, inject } from "tsyringe"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { envelope } from "../../../utils"
import {
  CreatePetDto,
  CreatePetUseCase,
  FileUploadDto,
  GetPetsFeedUseCase,
  GetUserPetsUseCase,
  UploadPetPictureUseCase,
} from "../../../../../domain/usecases"
import { validateDto } from "../../../../../core/utils"

@injectable()
export class PetController {
  constructor(
    @inject(CreatePetUseCase)
    private readonly createPetUseCase: CreatePetUseCase,
    @inject(GetUserPetsUseCase)
    private readonly getUserPetsUseCase: GetUserPetsUseCase,
    @inject(GetPetsFeedUseCase)
    private readonly getPetsFeedUseCase: GetPetsFeedUseCase,
    @inject(UploadPetPictureUseCase)
    private readonly uploadPetPictureUseCase: UploadPetPictureUseCase
  ) {}

  getPetsFeed = async (request: Request, response: Response) => {
    const pets = await this.getPetsFeedUseCase.execute({
      user: request.context.user,
      pagination: request.context.pagination,
    })

    return response.json(envelope(pets))
  }

  getUserPets = async (request: Request, response: Response) => {
    const pets = await this.getUserPetsUseCase.execute({
      userIdThatPetsBelongTo: request.params.userId,
    })

    return response.json(envelope(pets))
  }

  createPet = async (request: Request, response: Response) => {
    const dto = new CreatePetDto(request.body)

    await validateDto(dto)

    const pet = await this.createPetUseCase.execute(request.context.user, dto)

    return response.status(StatusCodes.CREATED).json(envelope(pet))
  }

  addPicture = async (request: Request, response: Response) => {
    const dto = new FileUploadDto({
      name: request.file.originalname,
      key: request.file.filename,
      url: request.file.destination,
      displayOrder: Number(request.body.displayOrder),
    })

    await validateDto(dto)

    const profilePicture = await this.uploadPetPictureUseCase.execute(
      request.context.user,
      request.params.petId,
      dto
    )

    return response.status(StatusCodes.CREATED).json(envelope(profilePicture))
  }
}
