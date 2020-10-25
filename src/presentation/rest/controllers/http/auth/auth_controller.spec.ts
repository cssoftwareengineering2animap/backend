import request from "supertest"
import faker from "faker"
import { container } from "tsyringe"
import { StatusCodes } from "http-status-codes"
import { app } from "../../../server"
import * as factory from "../../../../../infra/database/support/factory"
import * as connection from "../../../../../infra/database/support/connection"
import { User } from "../../../../../domain/entities/user_entity"
import * as authTestUtils from "../../../../../../test/utils/auth"
import {
  MailProvider,
  MailProviderToken,
} from "../../../../../domain/providers/mail_provider"
import { Host } from "../../../../../domain/entities/host_entity"

describe("Auth controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  describe("Login", () => {
    describe("A an user", () => {
      test("POST api/v1/login :: as a user, when email is not found, should return an error message", async () => {
        const user = await factory.build(User)

        const response = await request(app)
          .post("/api/v1/login")
          .send({ email: user.email, password: user.password })
          .expect(StatusCodes.UNAUTHORIZED)

        expect(response.body).toEqual([{ message: "Email não encontrado" }])
      })

      test("POST api/v1/login :: as a user, when password is not correct, should return an error message", async () => {
        const user = await factory.build(User)

        await request(app)
          .post("/api/v1/users")
          .send(user)
          .expect(StatusCodes.CREATED)

        const response = await request(app)
          .post("/api/v1/login")
          .send({ email: user.email, password: "incorrect_password" })
          .expect(StatusCodes.UNAUTHORIZED)

        expect(response.body).toEqual([{ message: "Senha incorreta" }])
      })

      test("POST api/v1/login :: as a user, when email exists & password is correct, should return a session token", async () => {
        const user = await factory.build(User)

        await request(app)
          .post("/api/v1/users")
          .send(user)
          .expect(StatusCodes.CREATED)

        const response = await request(app)
          .post("/api/v1/login")
          .send({ email: user.email, password: user.password })
          .expect(StatusCodes.OK)

        expect(response.body.data.token).toBeTruthy()
      })
    })

    describe("As a host", () => {
      test("POST api/v1/login :: as a host, when email is not found, should return an error message", async () => {
        const host = await factory.build(Host)

        const response = await request(app)
          .post("/api/v1/login")
          .send({ email: host.email, password: host.password })
          .expect(StatusCodes.UNAUTHORIZED)

        expect(response.body).toEqual([{ message: "Email não encontrado" }])
      })

      test("POST api/v1/login :: as a host, when password is not correct, should return an error message", async () => {
        const host = await factory.build(Host)

        await request(app)
          .post("/api/v1/hosts")
          .send(host)
          .expect(StatusCodes.CREATED)

        const response = await request(app)
          .post("/api/v1/login")
          .send({ email: host.email, password: "incorrect_password" })
          .expect(StatusCodes.UNAUTHORIZED)

        expect(response.body).toEqual([{ message: "Senha incorreta" }])
      })

      test("POST api/v1/login :: as a host, when email exists & password is correct, should return a session token", async () => {
        const host = await factory.build(Host)

        await request(app)
          .post("/api/v1/hosts")
          .send(host)
          .expect(StatusCodes.CREATED)

        const response = await request(app)
          .post("/api/v1/login")
          .send({ email: host.email, password: host.password })
          .expect(StatusCodes.OK)

        expect(response.body.data.token).toBeTruthy()
      })
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
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual([{ message: "Email não encontrado" }])
    })

    test("POST api/v1/forgot_password :: when email exists should send an email with a password recovery token", async () => {
      const user = await factory.create(User)

      await request(app)
        .post("/api/v1/forgot_password")
        .send({ email: user.email })
        .expect(StatusCodes.OK)

      expect(mailProvider.mailbox[0]).toMatchObject({ to: user.email })
    })

    test("PATCH api/v1/forgot_password :: when password recovery token is invalid, should return an error message", async () => {
      const response = await request(app)
        .patch("/api/v1/forgot_password")
        .send({ token: "any_invalid_token", password: "new_password" })
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual([{ message: "Token inválido ou expirado" }])
    })

    test("PATCH api/v1/forgot_password :: when password recovery token is valid, should change user password", async () => {
      const user = await factory.create(User)

      await request(app)
        .post("/api/v1/forgot_password")
        .send({ email: user.email })
        .expect(StatusCodes.OK)

      const passwordRecoveryToken = getPasswordRecoveryTokenFromMailBox()

      await request(app)
        .patch("/api/v1/forgot_password")
        .send({ token: passwordRecoveryToken, password: "new_password" })
        .expect(StatusCodes.OK)

      const sessionToken = await authTestUtils.login({
        app,
        client: { email: user.email, password: "new_password" },
      })

      expect(sessionToken).toBeDefined()
    })

    test("PATCH api/v1/forgot_password :: when password recovery is used, it cant be used again", async () => {
      const user = await factory.create(User)

      await request(app)
        .post("/api/v1/forgot_password")
        .send({ email: user.email })
        .expect(StatusCodes.OK)

      const passwordRecoveryToken = getPasswordRecoveryTokenFromMailBox()

      await request(app)
        .patch("/api/v1/forgot_password")
        .send({ token: passwordRecoveryToken, password: "new_password" })
        .expect(StatusCodes.OK)

      const response = await request(app)
        .patch("/api/v1/forgot_password")
        .send({ token: passwordRecoveryToken, password: "some_other_password" })
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.body).toEqual([{ message: "Token inválido ou expirado" }])
    })

    test("PATCH api/v1/forgot_password :: when user resets password, should invalidate user sessions", async () => {
      const user = await factory.create(User)

      const sessionToken = await authTestUtils.login({
        app,
        client: user,
      })

      await request(app)
        .post("/api/v1/forgot_password")
        .send({ email: user.email })
        .expect(StatusCodes.OK)

      const passwordRecoveryToken = getPasswordRecoveryTokenFromMailBox()

      await request(app)
        .patch("/api/v1/forgot_password")
        .send({ token: passwordRecoveryToken, password: "new_password" })
        .expect(StatusCodes.OK)

      await request(app)
        .get(`/api/v1/users/${user.id}/pets`)
        .set("Authorization", sessionToken)
        .expect(StatusCodes.UNAUTHORIZED)
    })
  })
})
