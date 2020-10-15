import { container, delay } from "tsyringe"
import { EncryptionProviderToken } from "../../domain/providers/encryption_provider"
import { MailProviderToken } from "../../domain/providers/mail_provider"
import { SessionProviderToken } from "../../domain/providers/session_provider"
import { BcryptEncryptionProvider } from "../../infra/providers/encryption/bcrypt_encryption_provider"
import { MailgunMailProvider } from "../../infra/providers/mail/mailgun_mail_provider"
import { RedisSessionProvider } from "../../infra/providers/session/redis_session_provider"

export const register = () => {
  container.register(EncryptionProviderToken, {
    useValue: container.resolve(BcryptEncryptionProvider),
  })

  container.register(SessionProviderToken, {
    useClass: delay(() => RedisSessionProvider),
  })

  container.register(MailProviderToken, {
    useValue: container.resolve(MailgunMailProvider),
  })
}
