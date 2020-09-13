import "reflect-metadata"
import http, { Server } from "http"
import express from "express"
import cors from "cors"
import socketio from "socket.io"
import socketioRedisAdapter from "socket.io-redis"
import { container as tsyringeContainer } from "tsyringe"
import { env } from "../../config/env"
import { loadRoutes } from "./utils/load_routes"
import * as connection from "../../infra/database/support/connection"
import { globalErrorHandler } from "./middlewares/global_error_handler"
import * as container from "./container"
import { ChatController } from "./controllers/ws/chat/chat_controller"
import { AckFunction, Message } from "./controllers/ws/types"

interface ServerStartResult {
  server: Server
  port: number | string
}

container.register()

export const app = express().use(express.json()).use(cors())

loadRoutes(app)

app.use(globalErrorHandler)

const server = new http.Server(app)

export const startSocketServer = () => {
  const io = socketio(server).adapter(
    socketioRedisAdapter({
      host: env.REDIS_CHAT_HOST,
      port: Number(env.REDIS_CHAT_PORT),
    })
  )

  io.on("connection", socket => {
    const chatController = tsyringeContainer.resolve(ChatController)

    const noOpAck = () => {}

    socket.on("chat:message", (message: Message, ack: AckFunction = noOpAck) =>
      chatController.onMessage(socket, message, ack)
    )

    socket.on("chat:join", (message: Message, ack: AckFunction = noOpAck) =>
      chatController.onJoin(socket, message, ack)
    )
  })
}

export const startHttpServer = async (): Promise<ServerStartResult> => {
  await connection.create()

  const port = env.PORT

  return { server: server.listen(port), port }
}
