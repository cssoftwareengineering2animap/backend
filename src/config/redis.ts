import { env } from "./env"

export const connections = [
  {
    name: "sessions",
    host: env.REDIS_SESSION_HOST,
    port: env.REDIS_SESSION_PORT,
    password: env.REDIS_SESSION_PASSWORD,
  },
  {
    name: "chat",
    host: env.REDIS_CHAT_HOST,
    port: env.REDIS_CHAT_PORT,
    password: env.REDIS_CHAT_PASSWORD,
  },
]
