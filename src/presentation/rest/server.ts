import "reflect-metadata"
import { Server } from "http"
import express from "express"
import cors from "cors"
import socketio from "socket.io"
import socketioRedisAdapter from "socket.io-redis"
import { env } from "../../config/env"
import { loadRoutes } from "./utils/load_routes"
import * as connection from "../../infra/database/support/connection"
import { globalErrorHandler } from "./middlewares/global_error_handler"
import * as container from "./container"

const io = socketio(3333)

io.adapter(socketioRedisAdapter({ host: "127.0.0.1", port: 6379 }))

io.emit("hello", "to all clients")
io.to("room42").emit("hello", "to all clients in 'room42' room")

io.on("connection", socket => {
  socket.broadcast.emit("hello", "to all clients except sender")
  socket
    .to("room42")
    .emit("hello", "to all clients in 'room42' room except sender")
})

interface ServerStartResult {
  server: Server
  port: number | string
}

container.register()

export const app = express().use(express.json()).use(cors())

loadRoutes(app)

app.use(globalErrorHandler)

const startServer = async (): Promise<ServerStartResult> => {
  await connection.create()

  const port = env.PORT
  return { server: app.listen(port, () => {}), port }
}

export default startServer
