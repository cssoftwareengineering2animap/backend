import * as uuid from "uuid"
import { inject, singleton } from "tsyringe"
import moment from "moment"
import {
  SessionProvider,
  SessionToken,
  SessionData,
  SessionType,
} from "../../../domain/providers/session_provider"
import { ID } from "../../../core/types/id"
import {
  EncryptionProvider,
  EncryptionProviderToken,
} from "../../../domain/providers/encryption_provider"
import { ApplicationError } from "../../../core/errors/application_error"
import { RedisProvider } from "../redis/redis_provider"
import { User } from "../../../domain/entities/user_entity"

const ONE_WEEK_IN_SECONDS = 604800

@singleton()
export class RedisSessionProvider implements SessionProvider {
  constructor(
    @inject(EncryptionProviderToken)
    private readonly encryptionProvider: EncryptionProvider,
    @inject(RedisProvider)
    private readonly redisProvider: RedisProvider
  ) {
    this.redisProvider.connection("sessions")
  }

  private sessionKeyFor = (id: ID) => `animap@sessions:${id}`

  public create = async (clientId: string, sessionType: SessionType) => {
    const sessionData = JSON.stringify({
      sessionType,
      clientId,
      sessionId: uuid.v4(),
      authenticatedAt: moment().format("YYYY-MM-DD hh:mm:ss"),
    })

    const sessionToken = this.encryptionProvider.encrypt(sessionData)

    await this.redisProvider.setex(
      this.sessionKeyFor(clientId),
      ONE_WEEK_IN_SECONDS,
      sessionData
    )

    return sessionToken
  }

  public destroyUserSessions = async (user: User | ID) => {
    const id = typeof user === "string" ? user : user.id
    await this.redisProvider.del(this.sessionKeyFor(id))
  }

  public destroy = async (sessionToken: SessionToken) => {
    const sessionData = await this.validateToken(sessionToken)
    if (!sessionData) {
      throw new ApplicationError(`Invalid session token: ${sessionToken}`)
    }

    await this.redisProvider.del(this.sessionKeyFor(sessionData.clientId))
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
      .get(this.sessionKeyFor(sessionData.clientId))
      .then(sessionAsString =>
        sessionAsString ? JSON.parse(sessionAsString) : null
      )

    if (session?.sessionId !== sessionData.sessionId) {
      return null
    }

    return sessionData
  }
}
