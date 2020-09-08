import { injectable } from "tsyringe"
import * as socketio from "socket.io"
import Redis from "ioredis"
import { ID } from "../../../../../core/types/id"
import { env } from "../../../../../config/env"

interface Message {
  room: ID
}

const prefix = "animap@chat"

@injectable()
export class ChatController {
  private redis = new Redis(Number(env.REDIS_CHAT_PORT), env.REDIS_CHAT_HOST, {
    password: env.REDIS_CHAT_PASSWORD,
  })

  onJoin = async (_socket: socketio.Socket, message: Message) => {
    console.log("ChatController.onJoin", message)
  }

  onMessage = async (_socket: socketio.Socket, message: Message) => {
    console.log("ChatController onMessage", message)
  }
}
