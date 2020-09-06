export interface EncryptionProvider {
  hash: (value: string) => Promise<string>
  compare: (value: string, hash: string) => Promise<boolean>
  encrypt: (value: string) => string
  decrypt: (encryptedValue: string) => string
}
