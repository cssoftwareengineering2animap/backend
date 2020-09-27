import request from "supertest"
import * as R from "ramda"
import {
  runInTransaction,
  initialiseTestTransactions,
} from "typeorm-test-transactions"
import { app } from "../../../server"
import * as factory from "../../../../../infra/database/support/factory"
import * as connection from "../../../../../infra/database/support/connection"
import { User } from "../../../../../domain/entities/user_entity"

initialiseTestTransactions()

describe("User controller functional test suite", () => {
  beforeAll(connection.create)

  test(
    "POST api/v1/users :: when email is invalid, should fail with an error message",
    runInTransaction(async () => {
      const user = await factory.build(User)
      user.email = null

      const response = await request(app)
        .post("/api/v1/users")
        .send(user)
        .expect(400)

      expect(response.body).toEqual([
        { message: "O email deve estar em um formato válido" },
      ])
    })
  )

  test(
    "POST api/v1/users :: when email is already in use, should fail with an error message",
    runInTransaction(async () => {
      const { email } = await factory.create(User)

      const user = await factory.build(User).then(data => ({ ...data, email }))

      const response = await request(app)
        .post("/api/v1/users")
        .send(user)
        .expect(400)

      expect(response.body).toEqual([{ message: "Esse email já está em uso" }])
    })
  )

  test(
    "POST api/v1/users :: when name is invalid, should fail with an error message",
    runInTransaction(async () => {
      const user = await factory.build(User)
      user.name = null

      const response = await request(app)
        .post("/api/v1/users")
        .send(user)
        .expect(400)

      expect(response.body[0].message).toBe("O nome deve ser informado")
    })
  )

  test(
    "POST api/v1/users :: when phone is invalid, should fail with an error message",
    runInTransaction(async () => {
      const user = await factory.build(User)
      user.phone = "123"

      const response = await request(app)
        .post("/api/v1/users")
        .send(user)
        .expect(400)

      expect(response.body).toEqual([
        { message: "O telefone deve ter no mínimo 10 dígitos" },
      ])
    })
  )

  test(
    "POST api/v1/users :: when phone is already in use, should fail with an error message",
    runInTransaction(async () => {
      const { phone } = await factory.create(User)

      const user = await factory.build(User)

      user.phone = phone

      const response = await request(app)
        .post("/api/v1/users")
        .send(user)
        .expect(400)

      expect(response.body).toEqual([
        { message: "Esse telefone já está em uso" },
      ])
    })
  )

  test(
    "POST api/v1/users :: when password is too short, should fail with an error message",
    runInTransaction(async () => {
      const user = await factory.build(User)
      user.password = "short"

      const response = await request(app)
        .post("/api/v1/users")
        .send(user)
        .expect(400)

      expect(response.body).toEqual([
        { message: "A senha deve ter no mínimo 6 caracteres" },
      ])
    })
  )
  test(
    "POST api/v1/users :: when all validation passes, should be able to create a new user",
    runInTransaction(async () => {
      const user = await factory.build(User)

      const response = await request(app)
        .post("/api/v1/users")
        .send(user)
        .expect(201)

      expect(response.body.data.id).toBeTruthy()

      expect(response.body.data).toMatchObject(R.omit(["password"], user))
    })
  )

  test.only(
    "POST api/v1/users/pictures :: should be able to upload a profile picture",
    runInTransaction(async () => {
      const user = await factory.create(User)

      const token = await request(app)
        .post("/api/v1/login")
        .send(user)
        .expect(200)
        .then(response => response.body.data.token)

      const response = await request(app)
        .post(`/api/v1/users/pictures`)
        .set("Authorization", token)
        .field("displayOrder", 0)
        .attach("file", "test/fixtures/files/gohorse1.jpeg")
        .expect(201)

      console.log("aaaaa", response.body)
    })
  )
})