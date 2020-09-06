import { ID } from "../../core/types/id"

type SessionToken = string

export interface SessionProvider {
  create: (userId: ID) => Promise<SessionToken>
  destroy: (session: SessionToken) => Promise<void>
}
