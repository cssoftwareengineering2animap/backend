import dotenv from "dotenv"

const envFilePath = (process.env.NODE_ENV as string).includes("test")
  ? ".env.testing"
  : ".env"

dotenv.config({ path: envFilePath })

const get = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`missing env key: ${key}`)
  }
  return value
}

const keys = [
  "NODE_ENV",
  "APP_HOST",
  "APP_KEY",
  "PORT",
  "REDIS_SESSION_HOST",
  "REDIS_SESSION_PORT",
  "REDIS_SESSION_PASSWORD",
  "REDIS_CHAT_HOST",
  "REDIS_CHAT_PORT",
  "REDIS_CHAT_PASSWORD",
  "PASSWORD_RECOVERY_TOKEN_EXPIRATION_IN_SECONDS",
  "MAILGUN_API_KEY",
  "MAILGUN_DOMAIN",
] as const

export const env = Object.fromEntries(keys.map(key => [key, get(key)])) as {
  [key in typeof keys[number]]: string
}
