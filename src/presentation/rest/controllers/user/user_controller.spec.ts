import request from "supertest"
import { app } from "../../server"
import * as factory from "../../../../infra/database/support/factory"
import * as connection from "../../../../infra/database/support/connection"
import { User } from "../../../../domain/entities/user_entity"

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

    expect(response.body[0].property).toBe("email")
  })

  test.only("POST api/v1/users :: when email is already in use, should fail with an error message", async () => {
    const { email } = await factory.create(User)

    const user = await factory.build(User).then(data => ({ ...data, email }))

    const response = await request(app)
      .post("/api/v1/users")
      .send(user)
      .expect(400)

    expect(response.body[0].property).toBe("email")
  })

  test("POST api/v1/users :: when name is invalid, should fail with an error message", async () => {
    const user = await factory.build(User)
    user.name = null

    const response = await request(app)
      .post("/api/v1/users")
      .send(user)
      .expect(400)

    expect(response.body[0].property).toBe("name")
  })

  test("POST api/v1/users :: when phone is invalid, should fail with an error message", async () => {
    const user = await factory.build(User)
    user.phone = "invalid_phone"

    const response = await request(app)
      .post("/api/v1/users")
      .send(user)
      .expect(400)

    expect(response.body[0].property).toBe("phone")
  })

  test("POST api/v1/users :: when password is invalid, should fail with an error message", async () => {
    const user = await factory.build(User)
    user.phone = "short"

    const response = await request(app)
      .post("/api/v1/users")
      .send(user)
      .expect(400)

    expect(response.body[0].property).toBe("password")
  })

  /* test.only("POST api/v1/users :: when all validation passes, should be able to create a new user", async () => {
    const user = await factory.build(User)

    const response = await request(app).post("/api/v1/users").send(user)
    // .expect(201)

    console.log(response.body)
  }) */
})
