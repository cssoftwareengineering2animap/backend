import { ID } from "../../core/types/id"

export type SessionToken = string

export type SessionData = {
  userId: ID
  session_id: ID
  authenticated_at: string
}

export interface SessionProvider {
  create: (userId: ID) => Promise<SessionToken>
  destroy: (session: SessionToken) => Promise<void>
  validateToken: (sessionToken: SessionToken) => Promise<SessionData | null>
}
