import request from "supertest"
import * as R from "ramda"
import { getConnection } from "typeorm"
import { StatusCodes } from "http-status-codes"
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

  describe("POST api/v1/users/pets", () => {
    test("when name is too short, should return an error message", async () => {
      const user = await factory.create(User)

      const token = await authTestUtils.login({ app, client: user })

      const pet = await factory.build(Pet)

      pet.name = "a"

      const response = await request(app)
        .post(`/api/v1/pets`)
        .set("Authorization", token)
        .send(pet)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual([
        { message: "O nome do pet deve ter no mínimo 2 caracteres" },
      ])
    })

    test("when age is less than 0, should return an error message", async () => {
      const user = await factory.create(User)

      const token = await authTestUtils.login({ app, client: user })

      const pet = await factory.build(Pet)

      pet.age = -1

      const response = await request(app)
        .post(`/api/v1/pets`)
        .set("Authorization", token)
        .send(pet)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual([
        {
          message: "A data de nascimento do pet deve ser mínimo 0",
        },
      ])
    })

    test("when age is more than 100, should return an error message", async () => {
      const user = await factory.create(User)

      const token = await authTestUtils.login({ app, client: user })

      const pet = await factory.build(Pet)

      pet.age = 101

      const response = await request(app)
        .post(`/api/v1/pets`)
        .set("Authorization", token)
        .send(pet)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual([
        {
          message: "A data de nascimento do pet deve ser máximo 100",
        },
      ])
    })

    test("when observations is more than 255 characters, should return an error message", async () => {
      const user = await factory.create(User)

      const token = await authTestUtils.login({ app, client: user })

      const pet = await factory.build(Pet)

      pet.observations = "a".repeat(256)

      const response = await request(app)
        .post(`/api/v1/pets`)
        .set("Authorization", token)
        .send(pet)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual([
        {
          message: "As observações podem conter no máximo 255 caracteres",
        },
      ])
    })

    test("when type is not informed, should return an error message", async () => {
      const user = await factory.create(User)

      const token = await authTestUtils.login({ app, client: user })

      const pet = await factory.build(Pet)

      pet.type = null

      const response = await request(app)
        .post(`/api/v1/pets`)
        .set("Authorization", token)
        .send(pet)
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual([
        { message: "O tipo de animal deve ser informado" },
      ])
    })

    test("when all validation passes, should create the pet and associate it to the logged in user", async () => {
      const pet = await factory.build(Pet)

      const token = await authTestUtils.login({ app, client: pet.owner })

      const response = await request(app)
        .post(`/api/v1/pets`)
        .set("Authorization", token)
        .send(pet)
        .expect(StatusCodes.CREATED)

      expect(response.body.data.owner.id).toBe(pet.owner.id)

      expect(response.body.data).toMatchObject({
        name: pet.name,
        age: pet.age,
        type: pet.type,
        owner: {
          id: pet.owner.id,
        },
      })
    })
  })

  describe("GET api/v1/users/:userId/pets", () => {
    test("should be able to list user pets", async () => {
      const user = await factory.create(User)

      const token = await authTestUtils.login({ app, client: user })

      const pets = await Promise.all(
        R.range(0, 5).map(() =>
          factory
            .build(Pet)
            .then(pet =>
              request(app)
                .post(`/api/v1/pets`)
                .set("Authorization", token)
                .send(pet)
                .expect(StatusCodes.CREATED)
            )
            .then(response => response.body.data)
        )
      )

      const response = await request(app)
        .get(`/api/v1/users/${user.id}/pets`)
        .set("Authorization", token)
        .expect(StatusCodes.OK)

      const expectedPetIds = pets.map(pet => pet.id).sort()

      const responsePetIds = response.body.data
        .map(({ node }) => node.id)
        .sort()

      expect(responsePetIds).toEqual(expectedPetIds)
    })

    test("a blocked user should not be able to fetch the pets that belong to user that blocked him/her", async () => {
      const blocker = await factory.create(User)
      const blocked = await factory.create(User)

      await request(app)
        .post(`/api/v1/users/${blocked.id}/blocked_users`)
        .set(
          "Authorization",
          await authTestUtils.login({ app, client: blocker })
        )
        .expect(StatusCodes.OK)

      await request(app)
        .get(`/api/v1/users/${blocker.id}/pets`)
        .set(
          "Authorization",
          await authTestUtils.login({ app, client: blocked })
        )
        .expect(StatusCodes.FORBIDDEN)
    })
  })

  describe("POST /api/v1/pets/id/pictures", () => {
    test("should be able to upload pet pictures", async () => {
      const user = await factory.create(User)

      const pet = await factory.create(Pet, { owner: user })

      const token = await authTestUtils.login({ app, client: user })

      const response = await request(app)
        .post(`/api/v1/pets/${pet.id}/pictures`)
        .set("Authorization", token)
        .field("displayOrder", 0)
        .attach("file", "test/fixtures/files/gohorse1.jpeg")
        .expect(StatusCodes.CREATED)

      expect(response.body.data.id).toBeTruthy()
    })

    test("when pet already has 20 pictures and  user tries to upload one more, should return an error", async () => {
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
        .post(`/api/v1/pets/${pet.id}/pictures`)
        .set("Authorization", token)
        .field("displayOrder", 0)
        .attach("file", "test/fixtures/files/gohorse1.jpeg")
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual([{ message: "Limite de fotos excedido" }])
    })
  })

  describe("GET api/v1/pets/feed", () => {
    test("should return a paginated list of pets", async () => {
      await Promise.all(R.range(0, 10).map(() => factory.create(Pet)))

      const user = await factory.create(User)
      const token = await authTestUtils.login({ app, client: user })

      const response = await request(app)
        .get(`/api/v1/pets/feed?page=0&limit=20`)
        .set("Authorization", token)
        .expect(StatusCodes.OK)

      expect(response.body.data.length).toBe(10)
    })
  })
})
