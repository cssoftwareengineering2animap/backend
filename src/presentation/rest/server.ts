import "reflect-metadata"
import { Server } from "http"
import express from "express"
import cors from "cors"
import { container } from "tsyringe"
import { env } from "../../config/env"
import { loadRoutes } from "./utils/load_routes"
import * as connection from "../../infra/database/support/connection"
import { BcryptEncryptionProvider } from "../../infra/encryption/bcrypt_encryption_provider"

container.register("EncryptionProvider", {
  useClass: BcryptEncryptionProvider,
})

interface ServerStartResult {
  server: Server
  port: number | string
}

export const app = express().use(express.json()).use(cors())

loadRoutes(app)

const startServer = async (): Promise<ServerStartResult> => {
  await connection.create()

  const port = env.PORT
  return { server: app.listen(port, () => {}), port }
}

export default startServer
