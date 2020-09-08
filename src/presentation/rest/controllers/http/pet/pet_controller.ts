import { injectable, inject } from "tsyringe"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { validateDto } from "../../../../../core/utils/validate_dto"
import { CreatePetUseCase } from "../../../../../domain/usecases/pet/create_pet/create_pet_use_case"
import { envelope } from "../../../utils/envelope"
import { GetPetsUseCase } from "../../../../../domain/usecases/pet/get_pets/get_pets_use_case"
import { CreatePetDto } from "../../../../../domain/usecases/pet/create_pet/create_pet_dto"

@injectable()
export class PetController {
  constructor(
    @inject(CreatePetUseCase)
    private readonly createPetUseCase: CreatePetUseCase,
    @inject(GetPetsUseCase)
    private readonly getPetsUseCase: GetPetsUseCase
  ) {}

  getPets = async (request: Request, response: Response) => {
    const pets = await this.getPetsUseCase.execute(request.context.user.id)

    return response.json(envelope(pets))
  }

  createPet = async (request: Request, response: Response) => {
    const dto = new CreatePetDto(request.body)

    await validateDto(dto)

    const pet = await this.createPetUseCase.execute(request.context.user, dto)

    return response.status(StatusCodes.CREATED).json(envelope(pet))
  }
}
