import { injectable, inject } from "tsyringe"
import { User } from "../../../entities/user_entity"
import { EncryptionProvider } from "../../../providers/encryption_provider"
import { LoginDto } from "./login_dto"
import { UnauthorizedError } from "../../../../core/errors/unauthorized_error"
import { SessionProvider } from "../../../providers/session_provider"

@injectable()
export class LoginUseCase {
  constructor(
    @inject("SessionProvider")
    private readonly sessionProvider: SessionProvider,
    @inject("EncryptionProvider")
    private readonly encryptionProvider: EncryptionProvider
  ) {}

  execute = async (data: LoginDto) => {
    const user = await User.findOne(
      { email: data.email },
      { select: ["id", "password"] }
    )
    if (!user) {
      throw new UnauthorizedError("Email não encontrado")
    }

    const isPasswordCorrect = await this.encryptionProvider.compare(
      data.password,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      user.password!
    )
    if (!isPasswordCorrect) {
      throw new UnauthorizedError("Senha incorreta")
    }

    return this.sessionProvider.create(user.id)
  }
}
