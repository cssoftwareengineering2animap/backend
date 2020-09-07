import { injectable, inject } from "tsyringe"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { CreatePetDto } from "../../../../domain/usecases/pet/create_pet_dto"
import { validateDto } from "../../../../core/utils/validate_dto"
import { CreatePetUseCase } from "../../../../domain/usecases/pet/create_pet_use_case"
import { envelope } from "../../utils/envelope"

@injectable()
export class PetController {
  constructor(
    @inject(CreatePetUseCase)
    private readonly createPetUseCase: CreatePetUseCase
  ) {}

  createPet = async (request: Request, response: Response) => {
    const dto = new CreatePetDto(request.body)

    await validateDto(dto)

    const pet = await this.createPetUseCase.execute(request.context.user, dto)

    return response.status(StatusCodes.CREATED).json(envelope(pet))
  }
}
