import * as uuid from "uuid"
import { inject, singleton } from "tsyringe"
import moment from "moment"
// eslint-disable-next-line import/no-cycle
import { RedisProvider } from ".."
import { ApplicationError } from "../../../core/errors"
import { ID } from "../../../core/types"
import {
  SessionProvider,
  EncryptionProviderToken,
  EncryptionProvider,
  SessionType,
  SessionToken,
  SessionData,
} from "../../../domain/providers"

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

  public destroyUserSessions = async (user: { id: ID } | ID) => {
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
