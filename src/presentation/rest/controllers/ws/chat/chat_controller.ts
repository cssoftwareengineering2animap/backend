import { inject, injectable } from "tsyringe"
import * as socketio from "socket.io"
import { AckFunction, Message } from "../types"
import {
  SaveChatMessageUseCase,
  SaveChatMessageDto,
} from "../../../../../domain/usecases"

@injectable()
export class ChatController {
  constructor(
    @inject(SaveChatMessageUseCase)
    private readonly saveChatMessageUseCase: SaveChatMessageUseCase
  ) {}

  onJoin = async (
    socket: socketio.Socket,
    message: Omit<Message, "data">,
    ack: AckFunction
  ) => {
    socket.join(message.room)
    ack({ ok: true })
  }

  onMessage = async (
    socket: socketio.Socket,
    message: Message,
    ack: AckFunction
  ) => {
    socket.to(message.room).emit("chat:message", message)
    ack()

    const [from, to] = message.room.split(",")

    await this.saveChatMessageUseCase.execute(
      new SaveChatMessageDto({ from, to, content: message.data })
    )
  }
}
