import "reflect-metadata"
import { Server } from "http"
import express from "express"
import cors from "cors"
import { createConnection } from "typeorm"
import { env } from "../../config/env"
import { loadRoutes } from "./utils/load_routes"

interface ServerStartResult {
  server: Server
  port: number | string
}

export const app = express().use(express.json()).use(cors())

loadRoutes(app)

const startServer = async (): Promise<ServerStartResult> => {
  await createConnection(env.NODE_ENV)

  const port = env.PORT
  return { server: app.listen(port, () => {}), port }
}

export default startServer
