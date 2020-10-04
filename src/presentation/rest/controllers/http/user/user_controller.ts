import { injectable, inject } from "tsyringe"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import { CreateUserUseCase } from "../../../../../domain/usecases/user/create_user/create_user_use_case"
import { CreateUserDto } from "../../../../../domain/usecases/user/create_user/create_user_dto"
import { envelope } from "../../../utils/envelope"
import { validateDto } from "../../../../../core/utils/validate_dto"
import { UploadUserPictureUseCase } from "../../../../../domain/usecases/user/upload_user_picture/upload_user_picture_use_case"
import { FileUploadDto } from "../../../../../domain/usecases/dtos/file_upload_dto"
import { BlockUserDto } from "../../../../../domain/usecases/user/block_user/block_user_dto"
import { BlockUserUseCase } from "../../../../../domain/usecases/user/block_user/block_user_use_case"

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
      user: request.context.user,
      userThatWillBeBlockedId: request.params.userId,
    })

    await validateDto(dto)

    await this.blockUserUseCase.execute(dto)

    return response.status(StatusCodes.OK).send()
  }
}
