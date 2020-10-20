import request from "supertest"
import * as R from "ramda"
import { getConnection } from "typeorm"
import { app } from "../../../server"
import * as factory from "../../../../../infra/database/support/factory"
import * as connection from "../../../../../infra/database/support/connection"
import { User } from "../../../../../domain/entities/user_entity"
import { Pet } from "../../../../../domain/entities/pet_entity"
import { File } from "../../../../../domain/entities/file_entity"
import * as authTestUtils from "../../../../../../test/utils/auth"

describe("Pet controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  test("POST api/v1/users/:userId/pets :: when name is too short, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await authTestUtils.login({ app, client: user })

    const pet = await factory.build(Pet)

    pet.name = "a"

    const response = await request(app)
      .post(`/api/v1/users/${user.id}/pets`)
      .set("Authorization", token)
      .send(pet)
      .expect(400)

    expect(response.body).toEqual([
      { message: "O nome do pet deve ter no mínimo 2 caracteres" },
    ])
  })

  test("POST api/v1/users/:userId/pets :: when birthday not informed or is in the wrong format, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await authTestUtils.login({ app, client: user })

    const pet = await factory.build(Pet)

    pet.birthday = null

    const response = await request(app)
      .post(`/api/v1/users/${user.id}/pets`)
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

  test("POST api/v1/users/:userId/pets :: when sex is not informed or is an unexpected value, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await authTestUtils.login({ app, client: user })

    const pet = await factory.build(Pet, { sex: "unknown" })

    const response = await request(app)
      .post(`/api/v1/users/${user.id}/pets`)
      .set("Authorization", token)
      .send(pet)
      .expect(400)

    expect(response.body).toEqual([
      { message: "O sexo do animal deve ser macho ou fêmea" },
    ])
  })

  test("POST api/v1/users/:userId/pets :: when type is not informed, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await authTestUtils.login({ app, client: user })

    const pet = await factory.build(Pet)

    pet.type = null

    const response = await request(app)
      .post(`/api/v1/users/${user.id}/pets`)
      .set("Authorization", token)
      .send(pet)
      .expect(400)

    expect(response.body).toEqual([
      { message: "O tipo de animal deve ser informado" },
    ])
  })

  test("POST api/v1/users/:userId/pets :: when all validation passes, should create the pet and associate it to the logged in user", async () => {
    const user = await factory.create(User)

    const token = await authTestUtils.login({ app, client: user })

    const pet = await factory.build(Pet)

    const response = await request(app)
      .post(`/api/v1/users/${user.id}/pets`)
      .set("Authorization", token)
      .send(pet)
      .expect(201)

    expect(response.body.data.owner.id).toBe(user.id)

    expect(response.body.data).toMatchObject(pet)
  })

  test("GET api/v1/users/:userId/pets :: should be able to list user pets", async () => {
    const user = await factory.create(User)

    const token = await authTestUtils.login({ app, client: user })

    const pets = await Promise.all(
      R.range(0, 5).map(() =>
        factory
          .build(Pet)
          .then(pet =>
            request(app)
              .post(`/api/v1/users/${user.id}/pets`)
              .set("Authorization", token)
              .send(pet)
              .expect(201)
          )
          .then(response => response.body.data)
      )
    )

    const response = await request(app)
      .get(`/api/v1/users/${user.id}/pets`)
      .set("Authorization", token)
      .expect(200)

    const expectedPetIds = pets.map(pet => pet.id).sort()

    const responsePetIds = response.body.data.map(({ node }) => node.id).sort()

    expect(responsePetIds).toEqual(expectedPetIds)
  })

  test("POST /api/v1/users/:userId/pets/id/pictures` :: should be able to upload pet pictures", async () => {
    const user = await factory.create(User)

    const pet = await factory.create(Pet, { owner: user })

    const token = await authTestUtils.login({ app, client: user })

    const response = await request(app)
      .post(`/api/v1/users/${user.id}/pets/${pet.id}/pictures`)
      .set("Authorization", token)
      .field("displayOrder", 0)
      .attach("file", "test/fixtures/files/gohorse1.jpeg")
      .expect(201)

    expect(response.body.data.id).toBeTruthy()
  })

  test("POST api/v1/users/:userId/pets/:id/pictures :: when pet already has 20 pictures and  user tries to upload one more, should return an error", async () => {
    const user = await factory.create(User)

    const pet = await factory.create(Pet, { owner: user })

    const token = await authTestUtils.login({ app, client: user })

    const files = await Promise.all(
      R.range(0, 21).map(() => factory.create(File))
    )

    await Promise.all(
      files.map(file =>
        getConnection()
          .createQueryBuilder()
          .relation(Pet, "pictures")
          .of(pet)
          .add(file)
      )
    )

    const response = await request(app)
      .post(`/api/v1/users/${user.id}/pets/${pet.id}/pictures`)
      .set("Authorization", token)
      .field("displayOrder", 0)
      .attach("file", "test/fixtures/files/gohorse1.jpeg")
      .expect(400)

    expect(response.body).toEqual([{ message: "Limite de fotos excedido" }])
  })

  describe("GET api/v1/users/:userId/pets :: when the user is blocked", () => {
    test("should not be able to fetch the pets that belong to user that blocked him/her", async () => {
      const blocker = await factory.create(User)
      const blocked = await factory.create(User)

      await request(app)
        .post(`/api/v1/users/${blocked.id}/blocked_users`)
        .set(
          "Authorization",
          await authTestUtils.login({ app, client: blocker })
        )
        .expect(200)

      await request(app)
        .get(`/api/v1/users/${blocker.id}/pets`)
        .set(
          "Authorization",
          await authTestUtils.login({ app, client: blocked })
        )
        .expect(403)
    })
  })

  describe("api/v1/pets/feed", () => {
    test.only("GET :: should return a paginated list of pets", async () => {
      await Promise.all(R.range(0, 10).map(() => factory.create(Pet)))

      const user = await factory.create(User)
      const token = await authTestUtils.login({ app, client: user })

      const response = await request(app)
        .get(`/api/v1/pets/feed?page=0&limit=20`)
        .set("Authorization", token)
        .expect(200)

      expect(response.body.data.length).toBe(10)
    })
  })
})
