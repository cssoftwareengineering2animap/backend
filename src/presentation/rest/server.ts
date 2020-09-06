import "reflect-metadata"
import { Server } from "http"
import express from "express"
import cors from "cors"
import { container, delay } from "tsyringe"
import { env } from "../../config/env"
import { loadRoutes } from "./utils/load_routes"
import * as connection from "../../infra/database/support/connection"
import { BcryptEncryptionProvider } from "../../infra/providers/encryption/bcrypt_encryption_provider"
import { globalErrorHandler } from "./middlewares/global_error_handler"
import { RedisSessionProvider } from "../../infra/providers/session/redis_session_provider"

container.register("EncryptionProvider", {
  useClass: BcryptEncryptionProvider,
})

container.register("SessionProvider", {
  useClass: delay(() => RedisSessionProvider),
})

interface ServerStartResult {
  server: Server
  port: number | string
}

export const app = express().use(express.json()).use(cors())

loadRoutes(app)

app.use(globalErrorHandler)

const startServer = async (): Promise<ServerStartResult> => {
  await connection.create()

  const port = env.PORT
  return { server: app.listen(port, () => {}), port }
}

export default startServer
