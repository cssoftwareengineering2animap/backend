import { inject, injectable } from "tsyringe"
import cuid from "cuid"
import { ValidationError } from "../../../../core/errors/validation_error"
import { User } from "../../../entities/user_entity"
import { RedisProvider } from "../../../../infra/providers/redis/redis_provider"
import { RequestForgotPasswordTokenDto } from "./request_forgot_password_token_dto"
import { env } from "../../../../config/env"

@injectable()
export class RequestForgotPasswordTokenUseCase {
  constructor(
    @inject(RedisProvider)
    private readonly redisProvider: RedisProvider
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

    return token
  }
}
