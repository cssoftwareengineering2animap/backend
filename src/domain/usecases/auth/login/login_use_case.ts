import { injectable, inject } from "tsyringe"
import { User } from "../../../entities/user_entity"

import { LoginDto } from "./login_dto"
import {
  EncryptionProvider,
  EncryptionProviderToken,
  SessionProvider,
  SessionProviderToken,
  SessionType,
} from "../../../providers"
import { Host } from "../../../entities"
import { UnauthorizedError } from "../../../../core/errors"

@injectable()
export class LoginUseCase {
  constructor(
    @inject(SessionProviderToken)
    private readonly sessionProvider: SessionProvider,
    @inject(EncryptionProviderToken)
    private readonly encryptionProvider: EncryptionProvider
  ) {}

  private findByEmail = async (
    email: string
  ): Promise<[User | Host | undefined, SessionType]> => {
    const user = await User.findOne(
      { email },
      { select: ["id", "email", "password"] }
    )
    if (user) {
      return [user, "user"]
    }

    const host = await Host.findOne(
      { email },
      { select: ["id", "email", "password"] }
    )

    return [host, "host"]
  }

  execute = async (data: LoginDto) => {
    const [client, type] = await this.findByEmail(data.email)

    if (!client) {
      throw new UnauthorizedError("Email não encontrado")
    }

    const isPasswordCorrect = await this.encryptionProvider.compare(
      data.password,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      client.password!
    )
    if (!isPasswordCorrect) {
      throw new UnauthorizedError("Senha incorreta")
    }

    return this.sessionProvider.create(client.id, type)
  }
}
