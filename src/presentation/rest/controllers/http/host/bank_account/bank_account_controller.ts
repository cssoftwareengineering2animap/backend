import { inject, injectable } from "tsyringe"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import {
  CreateBankAccountUseCase,
  CreateBankAccountDto,
} from "../../../../../../domain/usecases"
import { envelope } from "../../../../utils"
import { validateDto } from "../../../../../../core/utils"

@injectable()
export class BankAccountController {
  constructor(
    @inject(CreateBankAccountUseCase)
    private readonly createBankAccountUseCase: CreateBankAccountUseCase
  ) {}

  createBankAccount = async (request: Request, response: Response) => {
    const dto = new CreateBankAccountDto({
      ...request.body,
      owner: request.context.host,
    })

    await validateDto(dto)

    const user = await this.createBankAccountUseCase.execute(dto)

    return response.status(StatusCodes.CREATED).json(envelope(user))
  }
}
