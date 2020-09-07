import request from "supertest"
import { app } from "../../server"
import * as factory from "../../../../infra/database/support/factory"
import * as connection from "../../../../infra/database/support/connection"
import { User } from "../../../../domain/entities/user_entity"
import { Pet } from "../../../../domain/entities/pet_entity"

describe("Pet controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  test("POST api/v1/:user_id/pets :: when name is too short, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await request(app)
      .post("/api/v1/login")
      .send({ email: user.email, password: user.password })
      .then(response => response.body.data.token)

    const pet = await factory.build(Pet)

    pet.name = "a"

    const response = await request(app)
      .post(`/api/v1/${user.id}/pets`)
      .set("Authorization", token)
      .send(pet)
      .expect(400)

    expect(response.body).toEqual([
      { message: "O nome do pet deve ter no mínimo 2 caracteres" },
    ])
  })

  test("POST api/v1/:user_id/pets :: when birthday not informed or is in the wrong format, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await request(app)
      .post("/api/v1/login")
      .send({ email: user.email, password: user.password })
      .then(response => response.body.data.token)

    const pet = await factory.build(Pet)

    pet.birthday = null

    const response = await request(app)
      .post(`/api/v1/${user.id}/pets`)
      .set("Authorization", token)
      .send(pet)
      .expect(400)

    expect(response.body).toEqual([
      {
        message:
          "A data de nascimento do pet deve ser informada no formato AAAA-MM-DD",
      },
    ])
  })

  test("POST api/v1/:user_id/pets :: when sex is not informed or is an unexpected value, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await request(app)
      .post("/api/v1/login")
      .send({ email: user.email, password: user.password })
      .then(response => response.body.data.token)

    const pet = await factory.build(Pet)

    pet.sex = "unknown"

    const response = await request(app)
      .post(`/api/v1/${user.id}/pets`)
      .set("Authorization", token)
      .send(pet)
      .expect(400)

    expect(response.body).toEqual([
      { message: "O sexo do animal deve ser macho ou fêmea" },
    ])
  })

  test("POST api/v1/:user_id/pets :: when type is not informed, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await request(app)
      .post("/api/v1/login")
      .send({ email: user.email, password: user.password })
      .then(response => response.body.data.token)

    const pet = await factory.build(Pet)

    pet.type = null

    const response = await request(app)
      .post(`/api/v1/${user.id}/pets`)
      .set("Authorization", token)
      .send(pet)
      .expect(400)

    expect(response.body).toEqual([
      { message: "O tipo de animal deve ser informado" },
    ])
  })

  test("POST api/v1/:user_id/pets :: when all validation passes, should create the pet and associate it to the logged in user", async () => {
    const user = await factory.create(User)

    const token = await request(app)
      .post("/api/v1/login")
      .send({ email: user.email, password: user.password })
      .then(response => response.body.data.token)

    const pet = await factory.build(Pet)

    const response = await request(app)
      .post(`/api/v1/${user.id}/pets`)
      .set("Authorization", token)
      .send(pet)
      .expect(201)

    expect(response.body.data.owner.id).toBe(user.id)

    expect(response.body.data).toMatchObject(pet)
  })
})
