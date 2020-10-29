import { inject, injectable } from "tsyringe"
import { ValidationError } from "../../../../core/errors/validation_error"
import { ID } from "../../../../core/types/id"
import { RedisProvider } from "../../../../infra/providers/redis/redis_provider"
import { Host } from "../../../entities/host_entity"
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
