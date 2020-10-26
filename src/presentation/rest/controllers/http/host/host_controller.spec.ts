import request from "supertest"
import * as R from "ramda"
import { StatusCodes } from "http-status-codes"
import { app } from "../../../server"
import * as factory from "../../../../../infra/database/support/factory"
import * as connection from "../../../../../infra/database/support/connection"
import { Host } from "../../../../../domain/entities/host_entity"
import { User } from "../../../../../domain/entities/user_entity"
import * as authTestUtils from "../../../../../../test/utils/auth"

describe("Host controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  test("POST api/v1/hosts :: when name is invalid, should fail with an error message", async () => {
    const host = await factory.build(Host)

    const overrides = [{ name: null }, { name: "s" }, { name: " " }]

    const responses = await Promise.all(
      overrides
        .map(override => ({ ...host, ...override }))
        .map(host => request(app).post("/api/v1/hosts").send(host))
    )

    for (const response of responses) {
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(response.body).toEqual([
        { message: "O nome deve conter no mínimo 4 letras" },
      ])
    }
  })

  test("POST api/v1/hosts :: when email is invalid, should fail with an error message", async () => {
    const host = await factory.build(Host)

    const overrides = [
      { email: null },
      { email: "s@invalid .com" },
      { email: "email @ com. " },
    ]

    const responses = await Promise.all(
      overrides
        .map(override => ({ ...host, ...override }))
        .map(host => request(app).post("/api/v1/hosts").send(host))
    )

    for (const response of responses) {
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(response.body).toEqual([
        { message: "O email deve estar em um formato válido" },
      ])
    }
  })

  test("POST api/v1/hosts :: when email is already in use, should fail with an error message", async () => {
    const { email } = await factory.create(Host)

    const host = await factory.build(Host, { email })

    const response = await request(app).post("/api/v1/hosts").send(host)

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(response.body).toEqual([{ message: "Esse email já está em uso" }])
  })

  test("POST api/v1/hosts :: when password is too short, should fail with an error message", async () => {
    const host = await factory.build(Host)

    const overrides = [
      { password: null },
      { password: "s@23" },
      { password: " " },
    ]

    const responses = await Promise.all(
      overrides
        .map(override => ({ ...host, ...override }))
        .map(host => request(app).post("/api/v1/hosts").send(host))
    )

    for (const response of responses) {
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(response.body).toEqual([
        { message: "A senha deve ter no mínimo 6 caracteres" },
      ])
    }
  })

  test("POST api/v1/hosts :: when cpf is already in use, should fail with an error message", async () => {
    const { cpf } = await factory.create(Host)

    const host = await factory.build(Host, { cpf })

    const response = await request(app).post("/api/v1/hosts").send(host)

    expect(response.status).toBe(StatusCodes.BAD_REQUEST)
    expect(response.body).toEqual([{ message: "Esse cpf já está em uso" }])
  })

  test("POST api/v1/hosts :: when cpf is invalid, should fail with an error message", async () => {
    const host = await factory.build(Host)

    const overrides = [{ cpf: "s" }, { cpf: " " }, { cpf: "83592353929523" }]

    const responses = await Promise.all(
      overrides
        .map(override => ({ ...host, ...override }))
        .map(host => request(app).post("/api/v1/hosts").send(host))
    )

    for (const response of responses) {
      expect(response.status).toBe(StatusCodes.BAD_REQUEST)
      expect(response.body).toEqual([{ message: "O cpf deve ser válido" }])
    }
  })

  test("POST api/v1/hosts :: when all validation passes, should create a host account", async () => {
    const host = await factory.build(Host)

    const response = await request(app).post("/api/v1/hosts").send(host)

    expect(response.status).toBe(StatusCodes.CREATED)

    expect(response.body.data).toMatchObject(R.omit(["password"], host))
  })

  test("POST api/v1/users/:userId/blockings :: one user should be able to block a host", async () => {
    const user = await factory.create(User)

    const host = await factory.create(Host)

    const token = await authTestUtils.login({ app, client: user })

    await request(app)
      .post(`/api/v1/hosts/${host.id}/blockings`)
      .set("Authorization", token)
      .expect(StatusCodes.OK)
  })
})
