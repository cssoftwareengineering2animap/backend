import request from "supertest"
import { StatusCodes } from "http-status-codes"
import { app } from "../../../server"
import * as factory from "../../../../../infra/database/support/factory"
import * as connection from "../../../../../infra/database/support/connection"
import { User, Rating } from "../../../../../domain/entities"

import * as authTestUtils from "../../../../../../test/utils/auth"

describe("User controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  test("POST /api/v1/users/:userId/ratings :: when stars is less than 0, should return an error message", async () => {
    const rating = await factory.build(Rating, { stars: -1 })

    const token = await authTestUtils.login({ app, client: rating.grader })

    const response = await request(app)
      .post(`/api/v1/users/${rating.user.id}/ratings`)
      .set("Authorization", token)
      .send(rating)
      .expect(StatusCodes.BAD_REQUEST)

    expect(response.body).toEqual([{ message: "O mínimo de estrelas é 0" }])
  })

  test("POST /api/v1/users/:userId/ratings :: when stars is more than 5, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await authTestUtils.login({ app, client: user })

    const rating = await factory.build(Rating)

    rating.grader = user
    rating.stars = 6

    const response = await request(app)
      .post(`/api/v1/users/${rating.user.id}/ratings`)
      .set("Authorization", token)
      .send(rating)
      .expect(StatusCodes.BAD_REQUEST)

    expect(response.body).toEqual([{ message: "O máximo de estrelas é 5" }])
  })

  test("POST /api/v1/users/:userId/ratings :: one user should be able to rate another user", async () => {
    const user = await factory.create(User)

    const token = await authTestUtils.login({ app, client: user })

    const rating = await factory.build(Rating)

    rating.grader = user

    const response = await request(app)
      .post(`/api/v1/users/${rating.user.id}/ratings`)
      .set("Authorization", token)
      .send(rating)
      .expect(StatusCodes.CREATED)

    expect(response.body.data.id).toBeDefined()
    expect(response.body.data).toMatchObject({
      stars: rating.stars,
      grader: { id: user.id },
    })
  })
})
