import * as bcrypt from "bcrypt"
import crypto from "crypto"
import { injectable } from "tsyringe"
import { EncryptionProvider } from "../../../domain/providers/encryption_provider"
import { env } from "../../../config/env"

const SALT_ROUNDS = 10

const config = {
  key: crypto.createHash("sha256").update(env.APP_KEY).digest(),
  alg: "aes256",
}

@injectable()
export class BcryptEncryptionProvider implements EncryptionProvider {
  public hash = (value: string) => bcrypt.hash(value, SALT_ROUNDS)

  public compare = (value: string, hash: string) => bcrypt.compare(value, hash)

  public encrypt = (value: string) => {
    const iv = crypto.randomBytes(16).toString("hex").slice(0, 16)

    const cipher = crypto.createCipheriv(config.alg, config.key, iv)

    const encrypted = `${cipher.update(value, "utf8", "hex")}${cipher.final(
      "hex"
    )}.${iv}`

    return Buffer.from(encrypted).toString("base64")
  }

  public decrypt = (encryptedValue: string) => {
    try {
      const [encrypted, iv] = Buffer.from(encryptedValue, "base64")
        .toString("utf8")
        .split(".")

      const decipher = crypto.createDecipheriv(config.alg, config.key, iv)

      return `${decipher.update(encrypted, "hex", "utf8")}${decipher.final(
        "utf8"
      )}`
    } catch (error) {
      return null
    }
  }
}
