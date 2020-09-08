import * as uuid from "uuid"
import { inject, injectable } from "tsyringe"
import moment from "moment"
import {
  SessionProvider,
  SessionToken,
  SessionData,
} from "../../../domain/providers/session_provider"
import { ID } from "../../../core/types/id"
import { EncryptionProvider } from "../../../domain/providers/encryption_provider"
import { ApplicationError } from "../../../core/errors/application_error"
import { RedisProvider } from "../redis/redis_provider"

const ONE_WEEK_IN_SECONDS = 604800

@injectable()
export class RedisSessionProvider implements SessionProvider {
  constructor(
    @inject("EncryptionProvider")
    private readonly encryptionProvider: EncryptionProvider,
    @inject(RedisProvider)
    private readonly redisProvider: RedisProvider
  ) {
    this.redisProvider.connection("sessions")
  }

  private sessionKeyFromUserId = (id: ID) => `animap@user_sessions:${id}`

  public create = async (userId: string) => {
    const sessionData = JSON.stringify({
      user_id: userId,
      session_id: uuid.v4(),
      authenticated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
    })

    const sessionToken = this.encryptionProvider.encrypt(sessionData)

    await this.redisProvider.setex(
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

    await this.redisProvider.del(this.sessionKeyFromUserId(sessionData.user_id))
  }

  public validateToken = async (
    sessionToken: SessionToken
  ): Promise<SessionData | null> => {
    const sessionDataAsString = this.encryptionProvider.decrypt(sessionToken)
    if (!sessionDataAsString) {
      return null
    }

    const sessionData = JSON.parse(sessionDataAsString)

    const session: SessionData | null = await this.redisProvider
      .get(this.sessionKeyFromUserId(sessionData.user_id))
      .then(sessionAsString =>
        sessionAsString ? JSON.parse(sessionAsString) : null
      )

    if (session?.session_id !== sessionData.session_id) {
      return null
    }

    return sessionData
  }
}
