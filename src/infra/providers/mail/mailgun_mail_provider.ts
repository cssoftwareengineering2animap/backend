import { singleton } from "tsyringe"
import mailgun from "mailgun-js"
import { env } from "../../../config"
import { MailProvider, SendMailOptions } from "../../../domain/providers"

const mg = mailgun({
  apiKey: env.MAILGUN_API_KEY,
  domain: env.MAILGUN_DOMAIN,
})

@singleton()
export class MailgunMailProvider implements MailProvider {
  public mailbox: SendMailOptions[] = []

  private faked = false

  send = async (options: SendMailOptions) => {
    if (this.faked) {
      this.mailbox.push(options)
      return
    }
    await mg.messages().send({ ...options, html: options.body })
  }

  fake = () => {
    this.mailbox = []
    this.faked = true
  }

  restore = () => {
    this.mailbox = []
    this.faked = false
  }
}
