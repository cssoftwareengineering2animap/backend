import io from "socket.io-client"
import * as connection from "../../../../../infra/database/support/connection"
import { startSocketServer, startHttpServer } from "../../../server"
import { env } from "../../../../../config/env"

const API_URL = `http://localhost:${env.PORT}`

describe("Chat websocket controller functional test suite", () => {
  beforeAll(async () => {
    // await connection.create()
    startSocketServer()
    await startHttpServer()
  })

  test("who knows", done => {
    const socket = io.connect(API_URL, {
      transports: ["websocket", "polling"],
      secure: true,
      reconnection: true,
      rejectUnauthorized: false,
    })

    socket.on("connect", () => console.log("connected"))
    socket.on("connect_error", console.log)
    socket.on("error", () => console.log("error"))

    socket.emit("message", { hello: "world" }, () => {
      console.log("ccccc")
      done()
    })
  })
})
