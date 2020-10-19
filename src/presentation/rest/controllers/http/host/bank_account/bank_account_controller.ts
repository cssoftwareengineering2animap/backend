import { inject, injectable } from "tsyringe"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { validateDto } from "../../../../../../core/utils/validate_dto"
import { envelope } from "../../../../utils/envelope"
import { CreateBankAccountDto } from "../../../../../../domain/usecases/host/bank_account/create_bank_account/create_bank_account_dto"
import { CreateBankAccountUseCase } from "../../../../../../domain/usecases/host/bank_account/create_bank_account/create_bank_account_use_case"

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
