import request from "supertest"
import { app } from "../../server"
import * as factory from "../../../../infra/database/support/factory"
import * as connection from "../../../../infra/database/support/connection"
import { User } from "../../../../domain/entities/user_entity"

describe("Auth controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  test("POST api/v1/login :: when email is not found, should return an error message", async () => {
    const user = await factory.build(User)

    const response = await request(app)
      .post("/api/v1/login")
      .send({ email: user.email, password: user.password })
      .expect(401)

    expect(response.body[0].message).toBe("Email não encontrado")
  })

  test("POST api/v1/login :: when password is not correct, should return an error message", async () => {
    const user = await factory.build(User)

    await request(app).post("/api/v1/users").send(user).expect(201)

    const response = await request(app)
      .post("/api/v1/login")
      .send({ email: user.email, password: "incorrect_password" })
      .expect(401)

    expect(response.body[0].message).toBe("Senha incorreta")
  })

  test("POST api/v1/login :: when email exists & password is correct, should return a session token", async () => {
    const user = await factory.build(User)

    await request(app).post("/api/v1/users").send(user).expect(201)

    const response = await request(app)
      .post("/api/v1/login")
      .send({ email: user.email, password: user.password })
      .expect(200)

    expect(response.body.data.token).toBeTruthy()
  })
})
