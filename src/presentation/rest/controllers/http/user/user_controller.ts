import { injectable, inject } from "tsyringe"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import { validateDto } from "../../../../../core/utils"
import {
  CreateUserUseCase,
  UploadUserPictureUseCase,
  BlockUserUseCase,
  CreateUserDto,
  FileUploadDto,
  BlockUserDto,
} from "../../../../../domain/usecases"
import { envelope } from "../../../utils"

@injectable()
export class UserController {
  constructor(
    @inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @inject(UploadUserPictureUseCase)
    private readonly uploadUserPictureUseCase: UploadUserPictureUseCase,
    @inject(BlockUserUseCase)
    private readonly blockUserUseCase: BlockUserUseCase
  ) {}

  createUser = async (request: Request, response: Response) => {
    const dto = new CreateUserDto(request.body)

    await validateDto(dto)

    const user = await this.createUserUseCase.execute(dto)

    return response.status(StatusCodes.CREATED).json(envelope(user))
  }

  addPicture = async (request: Request, response: Response) => {
    const dto = new FileUploadDto({
      name: request.file.originalname,
      key: request.file.filename,
      url: request.file.destination,
      displayOrder: Number(request.body.displayOrder),
    })

    await validateDto(dto)

    const profilePicture = await this.uploadUserPictureUseCase.execute(
      request.context.user,
      dto
    )

    return response.status(StatusCodes.CREATED).json(envelope(profilePicture))
  }

  blockUser = async (request: Request, response: Response) => {
    const dto = new BlockUserDto({
      user: request.params.userId,
      host: request.context.host,
    })

    await validateDto(dto)

    await this.blockUserUseCase.execute(dto)

    return response.status(StatusCodes.OK).send()
  }
}
