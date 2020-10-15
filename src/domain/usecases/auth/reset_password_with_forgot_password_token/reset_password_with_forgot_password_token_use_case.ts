import { inject, injectable } from "tsyringe"
import { ValidationError } from "../../../../core/errors/validation_error"
import { RedisProvider } from "../../../../infra/providers/redis/redis_provider"
import { User } from "../../../entities/user_entity"
import {
  SessionProvider,
  SessionProviderToken,
} from "../../../providers/session_provider"
import { ResetPasswordWithForgotPasswordTokenDto } from "./reset_password_with_forgot_password_token_dto"

@injectable()
export class ResetPasswordWithForgotPasswordTokenUseCase {
  constructor(
    @inject(RedisProvider)
    private readonly redisProvider: RedisProvider,
    @inject(SessionProviderToken)
    private readonly sessionProvider: SessionProvider
  ) {}

  execute = async ({
    token,
    password,
  }: ResetPasswordWithForgotPasswordTokenDto) => {
    const userId = await this.redisProvider.get(token)

    if (!userId) {
      throw new ValidationError([{ message: "Token inválido ou expirado" }])
    }

    const user = await User.findOneOrFail(userId)

    user.password = password

    await user.save()

    await this.redisProvider.del(token)

    await this.sessionProvider.destroyUserSessions(user)
  }
}
