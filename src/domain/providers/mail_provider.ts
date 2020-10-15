export interface SendMailOptions {
  from: string
  to: string
  subject: string
  body: string
}

export interface MailProvider {
  send: (options: SendMailOptions) => Promise<void>
  fake: () => void
  restore: () => void
  mailbox: SendMailOptions[]
}

export const MailProviderToken = Symbol.for("MailProvider")
