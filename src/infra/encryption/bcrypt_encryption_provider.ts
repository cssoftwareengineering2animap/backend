import * as bcrypt from "bcrypt"
import { EncryptionProvider } from "../../domain/providers/encryption_provider"

const SALT_ROUNDS = 10

export class BcryptEncryptionProvider implements EncryptionProvider {
  public hash = (value: string) => bcrypt.hash(value, SALT_ROUNDS)

  public compare = (value: string, hash: string) => bcrypt.compare(value, hash)
}
