import Redis from "ioredis"
import * as uuid from "uuid"
import { inject, injectable } from "tsyringe"
import moment from "moment"
import {
  SessionProvider,
  SessionToken,
  SessionData,
} from "../../../domain/providers/session_provider"
import { env } from "../../../config/env"
import { ID } from "../../../core/types/id"
import { EncryptionProvider } from "../../../domain/providers/encryption_provider"
import { ApplicationError } from "../../../core/errors/application_error"

const ONE_WEEK_IN_SECONDS = 604800

@injectable()
export class RedisSessionProvider implements SessionProvider {
  constructor(
    @inject("EncryptionProvider")
    private readonly encryptionProvider: EncryptionProvider
  ) {}

  private redis = new Redis(
    Number(env.REDIS_SESSION_PORT),
    env.REDIS_SESSION_HOST,
    {
      password: env.REDIS_SESSION_PASSWORD,
    }
  )

  private sessionKeyFromUserId = (id: ID) => `animap@user_sessions:${id}`

  public create = async (userId: string) => {
    const sessionData = JSON.stringify({
      user_id: userId,
      session_id: uuid.v4(),
      authenticated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
    })

    const sessionToken = this.encryptionProvider.encrypt(sessionData)

    await this.redis.setex(
      this.sessionKeyFromUserId(userId),
      ONE_WEEK_IN_SECONDS,
      sessionData
    )

    return sessionToken
  }

  public destroy = async (sessionToken: SessionToken) => {
    const sessionData = await this.validateToken(sessionToken)
    if (!sessionData) {
      throw new ApplicationError(`Invalid session token: ${sessionToken}`)
    }

    await this.redis.del(this.sessionKeyFromUserId(sessionData.user_id))
  }

  public validateToken = async (
    sessionToken: SessionToken
  ): Promise<SessionData | null> => {
    const sessionDataAsString = this.encryptionProvider.decrypt(sessionToken)
    if (!sessionDataAsString) {
      return null
    }

    const sessionData = JSON.parse(sessionDataAsString)

    const session: SessionData | null = await this.redis
      .get(this.sessionKeyFromUserId(sessionData.user_id))
      .then(sessionAsString =>
        sessionAsString ? JSON.parse(sessionAsString) : null
      )

    if (!session) {
      return null
    }

    if (!session || session.session_id !== sessionData.session_id) {
      return null
    }

    return sessionData
  }
}
