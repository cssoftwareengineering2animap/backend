import { injectable } from "tsyringe"
import mailgun from "mailgun-js"
import { env } from "../../../config/env"
import {
  MailProvider,
  SendMailOptions,
} from "../../../domain/providers/mail_provider"

const mg = mailgun({
  apiKey: env.MAILGUN_API_KEY,
  domain: env.MAILGUN_DOMAIN,
})

@injectable()
export class MailgunMailProvider implements MailProvider {
  send = (options: SendMailOptions) =>
    new Promise<void>((resolve, reject) =>
      mg
        .messages()
        .send({ ...options, html: options.body }, error =>
          error ? reject(error) : resolve()
        )
    )
}
