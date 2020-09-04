export type Envelope<T> = { data: T }

export const envelope = <T>(value: T): Envelope<typeof value> => ({
  data: value,
})
