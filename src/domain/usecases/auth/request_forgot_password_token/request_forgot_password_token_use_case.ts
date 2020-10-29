import { inject, injectable } from "tsyringe"
import cuid from "cuid"
import { ValidationError } from "../../../../core/errors/validation_error"
import { User } from "../../../entities/user_entity"
import { RedisProvider } from "../../../../infra/providers/redis/redis_provider"
import { RequestForgotPasswordTokenDto } from "./request_forgot_password_token_dto"
import { env } from "../../../../config/env"
import {
  MailProvider,
  MailProviderToken,
} from "../../../providers/mail_provider"
import { Host } from "../../../entities/host_entity"

@injectable()
export class RequestForgotPasswordTokenUseCase {
  constructor(
    @inject(RedisProvider)
    private readonly redisProvider: RedisProvider,
    @inject(MailProviderToken) private readonly mailProvider: MailProvider
  ) {}

  private findByEmail = async (email: string) => {
    const [user, host] = await Promise.all([
      User.findOne({ where: { email } }),
      Host.findOne({ where: { email } }),
    ])

    return user ?? host
  }

  execute = async ({ email }: RequestForgotPasswordTokenDto) => {
    const client = await this.findByEmail(email)

    if (!client) {
      throw new ValidationError([{ message: "Email não encontrado" }])
    }

    const token = cuid.slug().toUpperCase()

    const payload = {
      id: client.id,
      type: client instanceof User ? "user" : "host",
    }

    await this.redisProvider.setex(
      token,
      Number(env.PASSWORD_RECOVERY_TOKEN_EXPIRATION_IN_SECONDS),
      JSON.stringify(payload)
    )

    await this.mailProvider.send({
      from: "naorespondae@animap.com.br",
      to: client.email,
      subject: `Animap - Seu código é ${token}`,
      body: `<h1>Seu código de recuperação de senha é ${token}</h1>`,
    })
  }
}
