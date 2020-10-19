import { IsNotEmpty } from "class-validator"
import { User } from "../../../../entities/user_entity"

export class CreateBankAccountDto {
  constructor(props: CreateBankAccountDto) {
    Object.assign(this, props)
  }

  @IsNotEmpty({
    message: "O dono da conta deve ser informado",
  })
  owner: User

  @IsNotEmpty({ message: "O banco deve ser informado" })
  bank: string

  @IsNotEmpty({ message: "A agência deve ser informada" })
  agency: string

  @IsNotEmpty({ message: "A conta deve ser informado" })
  account: string
}
