import request from "supertest"
import faker from "faker"
import { container } from "tsyringe"
import { app } from "../../../server"
import * as factory from "../../../../../infra/database/support/factory"
import * as connection from "../../../../../infra/database/support/connection"
import { User } from "../../../../../domain/entities/user_entity"
import * as userTestUtils from "../../../../../../test/utils/login"
import {
  MailProvider,
  MailProviderToken,
} from "../../../../../domain/providers/mail_provider"

describe("Auth controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  describe("Login", () => {
    test("POST api/v1/login :: when email is not found, should return an error message", async () => {
      const user = await factory.build(User)

      const response = await request(app)
        .post("/api/v1/login")
        .send({ email: user.email, password: user.password })
        .expect(401)

      expect(response.body).toEqual([{ message: "Email não encontrado" }])
    })

    test("POST api/v1/login :: when password is not correct, should return an error message", async () => {
      const user = await factory.build(User)

      await request(app).post("/api/v1/users").send(user).expect(201)

      const response = await request(app)
        .post("/api/v1/login")
        .send({ email: user.email, password: "incorrect_password" })
        .expect(401)

      expect(response.body).toEqual([{ message: "Senha incorreta" }])
    })

    test("POST api/v1/login :: when email exists & password is correct, should return a session token", async () => {
      const user = await factory.build(User)

      await request(app).post("/api/v1/users").send(user).expect(201)

      const response = await request(app)
        .post("/api/v1/login")
        .send({ email: user.email, password: user.password })
        .expect(200)

      expect(response.body.data.token).toBeTruthy()
    })
  })

  describe("Forgot password", () => {
    const mailProvider = container.resolve<MailProvider>(MailProviderToken)
    beforeEach(mailProvider.fake)
    afterAll(mailProvider.restore)

    const getPasswordRecoveryTokenFromMailBox = () =>
      mailProvider.mailbox[0].subject.split(" ").pop()

    test("POST api/v1/forgot_password :: when email does not exist should return an error message", async () => {
      const email = faker.internet.email()

      const response = await request(app)
        .post("/api/v1/forgot_password")
        .send({ email })
        .expect(400)

      expect(response.body).toEqual([{ message: "Email não encontrado" }])
    })

    test("POST api/v1/forgot_password :: when email exists should send an email to with a password recovery token", async () => {
      const user = await factory.create(User)

      await request(app)
        .post("/api/v1/forgot_password")
        .send({ email: user.email })
        .expect(200)

      expect(mailProvider.mailbox[0]).toMatchObject({ to: user.email })
    })

    test("PATCH api/v1/forgot_password :: when password recovery token is invalid, should return an error message", async () => {
      const response = await request(app)
        .patch("/api/v1/forgot_password")
        .send({ token: "any_invalid_token", password: "new_password" })
        .expect(400)

      expect(response.body).toEqual([{ message: "Token inválido ou expirado" }])
    })

    test("PATCH api/v1/forgot_password :: when password recovery token is valid, should change user password", async () => {
      const user = await factory.create(User)

      await request(app)
        .post("/api/v1/forgot_password")
        .send({ email: user.email })
        .expect(200)

      const passwordRecoveryToken = getPasswordRecoveryTokenFromMailBox()

      await request(app)
        .patch("/api/v1/forgot_password")
        .send({ token: passwordRecoveryToken, password: "new_password" })
        .expect(200)

      const sessionToken = await userTestUtils.login({
        app,
        user: { email: user.email, password: "new_password" },
      })

      expect(sessionToken).toBeDefined()
    })

    test("PATCH api/v1/forgot_password :: when password recovery is used, it cant be used again", async () => {
      const user = await factory.create(User)

      await request(app)
        .post("/api/v1/forgot_password")
        .send({ email: user.email })
        .expect(200)

      const passwordRecoveryToken = getPasswordRecoveryTokenFromMailBox()

      await request(app)
        .patch("/api/v1/forgot_password")
        .send({ token: passwordRecoveryToken, password: "new_password" })
        .expect(200)

      const response = await request(app)
        .patch("/api/v1/forgot_password")
        .send({ token: passwordRecoveryToken, password: "some_other_password" })
        .expect(400)

      expect(response.body).toEqual([{ message: "Token inválido ou expirado" }])
    })

    test("PATCH api/v1/forgot_password :: when user resets password, should invalidate user sessions", async () => {
      const user = await factory.create(User)

      const sessionToken = await userTestUtils.login({
        app,
        user,
      })

      await request(app)
        .post("/api/v1/forgot_password")
        .send({ email: user.email })
        .expect(200)

      const passwordRecoveryToken = getPasswordRecoveryTokenFromMailBox()

      await request(app)
        .patch("/api/v1/forgot_password")
        .send({ token: passwordRecoveryToken, password: "new_password" })
        .expect(200)

      await request(app)
        .get(`/api/v1/users/${user.id}/pets`)
        .set("Authorization", sessionToken)
        .expect(401)
    })
  })
})
