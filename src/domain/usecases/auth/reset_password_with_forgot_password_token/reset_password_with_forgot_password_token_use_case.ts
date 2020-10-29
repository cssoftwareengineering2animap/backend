import { inject, injectable } from "tsyringe"
import { ResetPasswordWithForgotPasswordTokenDto } from "../.."
import { ValidationError } from "../../../../core/errors"
import { RedisProvider } from "../../../../infra/providers"
import { User } from "../../../entities"
import { SessionProviderToken, SessionProvider } from "../../../providers"

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
