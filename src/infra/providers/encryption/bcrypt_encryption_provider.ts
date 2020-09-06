import * as bcrypt from "bcrypt"
import crypto from "crypto"
import { injectable } from "tsyringe"
import { EncryptionProvider } from "../../../domain/providers/encryption_provider"
import { env } from "../../../config/env"

const SALT_ROUNDS = 10
const cryptoKey = crypto.createHash("sha256").update(env.APP_KEY).digest()

@injectable()
export class BcryptEncryptionProvider implements EncryptionProvider {
  public hash = (value: string) => bcrypt.hash(value, SALT_ROUNDS)

  public compare = (value: string, hash: string) => bcrypt.compare(value, hash)

  public encrypt = (value: string) => {
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv("aes256", cryptoKey, iv)

    const encrypted = Buffer.concat([
      cipher.update(value, "utf8"),
      cipher.final(),
    ])

    return `${encrypted.toString("base64")}.${iv.toString("base64")}`
  }

  public decrypt = (encryptedValue: string) => "a"
}
