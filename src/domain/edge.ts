import { ID } from "../core/types/id"

export type Edge<T> = {
  cursor: string
  node: T
}

export const edge = <T extends { id: ID }>(value: T): Edge<T> => ({
  cursor: Buffer.from(value.id).toString("base64"),
  node: value,
})
