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
import { Pet } from "../../../../../domain/entities/pet_entity"

initialiseTestTransactions()

describe("Pet controller functional test suite", () => {
  beforeAll(connection.create)

  test(
    "POST api/v1/:user_id/pets :: when name is too short, should return an error message",
    runInTransaction(async () => {
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
  )

  test(
    "POST api/v1/:user_id/pets :: when birthday not informed or is in the wrong format, should return an error message",
    runInTransaction(async () => {
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
  )

  test(
    "POST api/v1/:user_id/pets :: when sex is not informed or is an unexpected value, should return an error message",
    runInTransaction(async () => {
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
  )

  test(
    "POST api/v1/:user_id/pets :: when type is not informed, should return an error message",
    runInTransaction(async () => {
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
  )

  test(
    "POST api/v1/:user_id/pets :: when all validation passes, should create the pet and associate it to the logged in user",
    runInTransaction(async () => {
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
  )

  test(
    "GET api/v1/:user_id/pets :: should be able to list user pets",
    runInTransaction(async () => {
      const user = await factory.create(User)

      const token = await request(app)
        .post("/api/v1/login")
        .send({ email: user.email, password: user.password })
        .then(response => response.body.data.token)

      const pets = await Promise.all(
        R.range(0, 5).map(() =>
          factory
            .build(Pet)
            .then(pet =>
              request(app)
                .post(`/api/v1/${user.id}/pets`)
                .set("Authorization", token)
                .send(pet)
                .expect(201)
            )
            .then(response => response.body.data)
        )
      )

      const response = await request(app)
        .get(`/api/v1/${user.id}/pets`)
        .set("Authorization", token)
        .expect(200)

      expect(pets.map(pet => pet.id)).toEqual(
        response.body.data.map(({ node }) => node.id)
      )
    })
  )
})