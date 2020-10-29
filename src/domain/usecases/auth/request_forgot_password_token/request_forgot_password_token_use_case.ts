import { inject, injectable } from "tsyringe"
import cuid from "cuid"
import { env } from "process"
import { RequestForgotPasswordTokenDto } from "../.."
import { ValidationError } from "../../../../core/errors"
import { RedisProvider } from "../../../../infra/providers"
import { User } from "../../../entities"
import { MailProviderToken, MailProvider } from "../../../providers"

@injectable()
export class RequestForgotPasswordTokenUseCase {
  constructor(
    @inject(RedisProvider)
    private readonly redisProvider: RedisProvider,
    @inject(MailProviderToken) private readonly mailProvider: MailProvider
  ) {}

  execute = async ({ email }: RequestForgotPasswordTokenDto) => {
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new ValidationError([{ message: "Email não encontrado" }])
    }

    const token = cuid.slug().toUpperCase()

    await this.redisProvider.setex(
      token,
      Number(env.PASSWORD_RECOVERY_TOKEN_EXPIRATION_IN_SECONDS),
      user.id
    )

    await this.mailProvider.send({
      from: "naorespondae@animap.com.br",
      to: user.email,
      subject: `Animap - Seu código é ${token}`,
      body: `<h1>Seu código de recuperação de senha é ${token}</h1>`,
    })
  }
}
