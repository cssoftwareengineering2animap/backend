import "reflect-metadata"
import { Server } from "http"
import express from "express"
import cors from "cors"
import { env } from "../../config/env"
import { loadRoutes } from "./utils/load_routes"
import * as connection from "../../infra/database/support/connection"
import { globalErrorHandler } from "./middlewares/global_error_handler"
import * as container from "./container"

interface ServerStartResult {
  server: Server
  port: number | string
}

export const app = express().use(express.json()).use(cors())

loadRoutes(app)

app.use(globalErrorHandler)

const startServer = async (): Promise<ServerStartResult> => {
  container.register()

  await connection.create()

  const port = env.PORT
  return { server: app.listen(port, () => {}), port }
}

export default startServer
