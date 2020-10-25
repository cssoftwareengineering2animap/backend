import io from "socket.io-client"
import { startSocketServer, startHttpServer } from "../../../server"
import { env } from "../../../../../config/env"

import * as factory from "../../../../../infra/database/support/factory"
import { User } from "../../../../../domain/entities/user_entity"
import { Message } from "../../../../../domain/entities/message_entity"

const connectSocket = () =>
  new Promise<SocketIOClient.Socket>((resolve, reject) => {
    const socket = io.connect(`${env.APP_HOST}:${env.PORT}`, {
      transports: ["websocket", "polling"],
      secure: true,
      reconnection: true,
      rejectUnauthorized: false,
    })

    socket.on("connect", () => resolve(socket))
    socket.on("connect_error", reject)
    socket.on("error", reject)
  })

const emit = (socket, event, data) =>
  new Promise((resolve, reject) => {
    socket.emit(event, data, resolve)
    socket.on("error", reject)
  })

describe("[Socket] Chat controller functional test suite", () => {
  beforeAll(async () => {
    startSocketServer()
    await startHttpServer()
  })

  test("can join a specific room with another user", async () => {
    const userA = await factory.create(User)
    const userB = await factory.create(User)

    const socket = await connectSocket()

    const room = Message.privateRoomFromUserIds([userA.id, userB.id])

    const response = await emit(socket, "chat:join", { room })

    expect(response).toEqual({ ok: true })
  })

  test("can send a message to a specific room", async done => {
    const userA = await factory.create(User)
    const userB = await factory.create(User)

    const socketA = await connectSocket()
    const socketB = await connectSocket()

    const room = Message.privateRoomFromUserIds([userA.id, userB.id])

    expect(await emit(socketA, "chat:join", { room })).toEqual({ ok: true })
    expect(await emit(socketB, "chat:join", { room })).toEqual({ ok: true })

    socketA.on("chat:message", message => {
      expect(message).toEqual({ room, data: "hello world" })
      done()
    })

    socketB.emit("chat:message", { room, data: "hello world" })
  })
})
