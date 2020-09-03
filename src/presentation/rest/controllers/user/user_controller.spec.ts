import request from "supertest"
import { app } from "../../server"
import * as factory from "../../../../infra/database/support/factory"
import { User } from "../../../../domain/entities/user_entity"

describe("User controller funcional test suite", () => {
  test("POST api/v1/users :: when cpf is invalid, should fail with an error message", async () => {
    const user = await factory.build(User)

    const response = await request(app)
      .post("/api/v1/users")
      .send(user)
      .expect(400)

    console.log(!!response)
  })
})
