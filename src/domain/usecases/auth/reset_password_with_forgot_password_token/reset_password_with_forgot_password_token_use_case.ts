import { inject, injectable } from "tsyringe"
import { ResetPasswordWithForgotPasswordTokenDto } from "./reset_password_with_forgot_password_token_dto"
import { ValidationError } from "../../../../core/errors"
import { ID } from "../../../../core/types"
import { RedisProvider } from "../../../../infra/providers"
import { User, Host } from "../../../entities"
import { SessionProviderToken, SessionProvider } from "../../../providers"

@injectable()
export class ResetPasswordWithForgotPasswordTokenUseCase {
  constructor(
    @inject(RedisProvider)
    private readonly redisProvider: RedisProvider,
    @inject(SessionProviderToken)
    private readonly sessionProvider: SessionProvider
  ) {}

  private findById = (payload: { id: ID; type: "host" | "user" }) =>
    payload.type === "host"
      ? Host.findOneOrFail(payload.id)
      : User.findOneOrFail(payload.id)

  execute = async ({
    token,
    password,
  }: ResetPasswordWithForgotPasswordTokenDto) => {
    const payload = await this.redisProvider
      .get(token)
      .then(value => (value ? JSON.parse(value) : null))

    if (!payload) {
      throw new ValidationError([{ message: "Token inválido ou expirado" }])
    }

    const client = await this.findById(payload)

    client.password = password

    await client.save()

    await this.redisProvider.del(token)

    await this.sessionProvider.destroySessionsFor(client)
  }
}
