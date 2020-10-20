import { injectable, inject } from "tsyringe"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { validateDto } from "../../../../../core/utils/validate_dto"
import { CreatePetUseCase } from "../../../../../domain/usecases/pet/create_pet/create_pet_use_case"
import { envelope } from "../../../utils/envelope"
import { CreatePetDto } from "../../../../../domain/usecases/pet/create_pet/create_pet_dto"
import { UploadPetPictureUseCase } from "../../../../../domain/usecases/pet/upload_pet_picture/upload_pet_picture_use_case"
import { FileUploadDto } from "../../../../../domain/usecases/dtos/file_upload_dto"
import { GetPetsFeedUseCase } from "../../../../../domain/usecases/pet/get_pets_feed/get_pets_feed_use_case"
import { GetUserPetsUseCase } from "../../../../../domain/usecases/pet/get_user_pets/get_user_pets_use_case"

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
      user: request.context.user,
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
