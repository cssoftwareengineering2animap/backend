import "reflect-metadata"
import { Server } from "http"
import express from "express"
import cors from "cors"
import { getConnectionOptions } from "typeorm"
import { createConnection } from "net"
import { env } from "./config/env"

interface ServerStartResult {
  server: Server
  port: number | string
}

const startServer = async (): Promise<ServerStartResult> => {
  const app = express()
  app.use(express.json())
  app.use(cors())

  const connectionOptions = await getConnectionOptions(env.NODE_ENV)

  await createConnection({
    ...connectionOptions,
    name: "default",
    entities: loadEntities(),
  })

  const port = env.PORT
  return { server: app.listen(port, () => {}), port }
}

export default startServer
