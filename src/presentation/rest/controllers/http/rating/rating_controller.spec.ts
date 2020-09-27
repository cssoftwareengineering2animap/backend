import request from "supertest"
import { app } from "../../../server"
import * as factory from "../../../../../infra/database/support/factory"
import * as connection from "../../../../../infra/database/support/connection"
import { User } from "../../../../../domain/entities/user_entity"
import { Rating } from "../../../../../domain/entities/rating_entity"

describe("User controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  test("POST /api/v1/users/:user_id/ratings :: when stars is less than 0, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await request(app)
      .post("/api/v1/login")
      .send(user)
      .expect(200)
      .then(response => response.body.data.token)

    const rating = await factory.build(Rating)

    rating.grader = user
    rating.stars = -1

    const response = await request(app)
      .post(`/api/v1/users/${rating.user.id}/ratings`)
      .set("Authorization", token)
      .send(rating)
      .expect(400)

    expect(response.body).toEqual([{ message: "O mínimo de estrelas é 0" }])
  })

  test("POST /api/v1/users/:user_id/ratings :: when stars is more than 5, should return an error message", async () => {
    const user = await factory.create(User)

    const token = await request(app)
      .post("/api/v1/login")
      .send(user)
      .expect(200)
      .then(response => response.body.data.token)

    const rating = await factory.build(Rating)

    rating.grader = user
    rating.stars = 6

    const response = await request(app)
      .post(`/api/v1/users/${rating.user.id}/ratings`)
      .set("Authorization", token)
      .send(rating)
      .expect(400)

    expect(response.body).toEqual([{ message: "O máximo de estrelas é 5" }])
  })

  test("POST /api/v1/users/:user_id/ratings :: one user should be able to rate another user", async () => {
    const user = await factory.create(User)

    const token = await request(app)
      .post("/api/v1/login")
      .send(user)
      .expect(200)
      .then(response => response.body.data.token)

    const rating = await factory.build(Rating)

    rating.grader = user

    const response = await request(app)
      .post(`/api/v1/users/${rating.user.id}/ratings`)
      .set("Authorization", token)
      .send(rating)
      .expect(201)

    expect(response.body.data.id).toBeDefined()
    expect(response.body.data).toMatchObject({
      stars: rating.stars,
      grader: { id: user.id },
    })
  })
})
