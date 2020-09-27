import request from "supertest"
import * as R from "ramda"
import { getConnection } from "typeorm"
import { app } from "../../../server"
import * as factory from "../../../../../infra/database/support/factory"
import * as connection from "../../../../../infra/database/support/connection"
import { User } from "../../../../../domain/entities/user_entity"
import { File } from "../../../../../domain/entities/file_entity"

describe("User controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  test("POST api/v1/users :: when email is invalid, should fail with an error message", async () => {
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

  test("POST api/v1/users :: when email is already in use, should fail with an error message", async () => {
    const { email } = await factory.create(User)

    const user = await factory.build(User).then(data => ({ ...data, email }))

    const response = await request(app)
      .post("/api/v1/users")
      .send(user)
      .expect(400)

    expect(response.body).toEqual([{ message: "Esse email já está em uso" }])
  })

  test("POST api/v1/users :: when name is invalid, should fail with an error message", async () => {
    const user = await factory.build(User)
    user.name = null

    const response = await request(app)
      .post("/api/v1/users")
      .send(user)
      .expect(400)

    expect(response.body[0].message).toBe("O nome deve ser informado")
  })

  test("POST api/v1/users :: when phone is invalid, should fail with an error message", async () => {
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

  test("POST api/v1/users :: when phone is already in use, should fail with an error message", async () => {
    const { phone } = await factory.create(User)

    const user = await factory.build(User)

    user.phone = phone

    const response = await request(app)
      .post("/api/v1/users")
      .send(user)
      .expect(400)

    expect(response.body).toEqual([{ message: "Esse telefone já está em uso" }])
  })

  test("POST api/v1/users :: when password is too short, should fail with an error message", async () => {
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
  test("POST api/v1/users :: when all validation passes, should be able to create a new user", async () => {
    const user = await factory.build(User)

    const response = await request(app)
      .post("/api/v1/users")
      .send(user)
      .expect(201)

    expect(response.body.data.id).toBeTruthy()

    expect(response.body.data).toMatchObject(R.omit(["password"], user))
  })

  test("POST api/v1/users/pictures :: should be able to upload profile pictures", async () => {
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

    expect(response.body.data.id).toBeTruthy()
  })

  test("POST api/v1/users/pictures :: when user already has 20 pictures and tries to upload one more, should return an error", async () => {
    const user = await factory.create(User)

    const { email, password } = user

    const files = await Promise.all(
      R.range(0, 21).map(() => factory.create(File))
    )

    await Promise.all(
      files.map(file =>
        getConnection()
          .createQueryBuilder()
          .relation(User, "pictures")
          .of(user)
          .add(file)
      )
    )

    const token = await request(app)
      .post("/api/v1/login")
      .send({ email, password })
      .expect(200)
      .then(response => response.body.data.token)

    const response = await request(app)
      .post(`/api/v1/users/pictures`)
      .set("Authorization", token)
      .field("displayOrder", 0)
      .attach("file", "test/fixtures/files/gohorse1.jpeg")
      .expect(400)

    expect(response.body).toEqual([{ message: "Limite de fotos excedido" }])
  })
})
