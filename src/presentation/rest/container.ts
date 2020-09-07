import { container, delay } from "tsyringe"
import { BcryptEncryptionProvider } from "../../infra/providers/encryption/bcrypt_encryption_provider"
import { RedisSessionProvider } from "../../infra/providers/session/redis_session_provider"

export const register = () => {
  container.register("EncryptionProvider", {
    useClass: BcryptEncryptionProvider,
  })

  container.register("SessionProvider", {
    useClass: delay(() => RedisSessionProvider),
  })
}
