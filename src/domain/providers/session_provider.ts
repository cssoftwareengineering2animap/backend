import { ID } from "../../core/types/id"

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
  destroyUserSessions: (user: { id: ID } | ID) => Promise<void>
}

export const SessionProviderToken = Symbol.for("SessionProvider")
