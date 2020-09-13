import { ID } from "../../../../core/types/id"

export type AckFunction = <T>(response?: T) => void

export interface Message {
  room: ID
  data: string
}
