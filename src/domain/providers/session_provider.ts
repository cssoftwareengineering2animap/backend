import { ID } from "../../core/types/id"
import { User } from "../entities/user_entity"

export type SessionToken = string

export type SessionType = "user" | "host"

export type SessionData = {
  sessionType: SessionType
  clientId: ID
  sessionId: ID
  authenticatedAt: string
}

export interface SessionProvider {
  create: (clientId: ID, sessionType: SessionType) => Promise<SessionToken>
  destroy: (session: SessionToken) => Promise<void>
  validateToken: (sessionToken: SessionToken) => Promise<SessionData | null>
  destroyUserSessions: (user: User | ID) => Promise<void>
}

export const SessionProviderToken = Symbol.for("SessionProvider")
