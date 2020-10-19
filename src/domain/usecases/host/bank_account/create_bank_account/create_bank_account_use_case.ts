import { injectable } from "tsyringe"
import { BankAccount } from "../../../../entities/bank_account_entity"
import { CreateBankAccountDto } from "./create_bank_account_dto"

@injectable()
export class CreateBankAccountUseCase {
  execute = (data: CreateBankAccountDto) => BankAccount.create(data).save()
}
