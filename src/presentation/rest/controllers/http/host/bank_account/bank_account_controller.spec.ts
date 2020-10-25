import request from "supertest"

import { StatusCodes } from "http-status-codes"
import * as factory from "../../../../../../infra/database/support/factory"
import * as connection from "../../../../../../infra/database/support/connection"
import { app } from "../../../../server"
import * as authTestUtils from "../../../../../../../test/utils/auth"
import { BankAccount } from "../../../../../../domain/entities/bank_account_entity"

describe("Host BankAccount controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  describe("POST api/v1/bank_accounts", () => {
    test("when bank is not informed, should fail with an error message", async () => {
      const bankAccount = await factory.build(BankAccount, {})

      const token = await authTestUtils.login({
        app,
        client: bankAccount.owner,
      })

      const overrides = [{ bank: null }, { bank: undefined }]

      const responses = await Promise.all(
        overrides
          .map(override => ({ ...bankAccount, ...override }))
          .map(host =>
            request(app)
              .post("/api/v1/bank_accounts")
              .set("Authorization", token)
              .send(host)
          )
      )

      for (const response of responses) {
        expect(response.status).toBe(400)
        expect(response.body).toEqual([
          { message: "O banco deve ser informado" },
        ])
      }
    })

    test("when agency is not informed, should fail with an error message", async () => {
      const bankAccount = await factory.build(BankAccount, {})

      const token = await authTestUtils.login({
        app,
        client: bankAccount.owner,
      })

      const overrides = [{ agency: null }, { agency: undefined }]

      const responses = await Promise.all(
        overrides
          .map(override => ({ ...bankAccount, ...override }))
          .map(host =>
            request(app)
              .post("/api/v1/bank_accounts")
              .set("Authorization", token)
              .send(host)
          )
      )

      for (const response of responses) {
        expect(response.status).toBe(400)
        expect(response.body).toEqual([
          { message: "A agência deve ser informada" },
        ])
      }
    })

    test("when account is not informed, should fail with an error message", async () => {
      const bankAccount = await factory.build(BankAccount)

      const token = await authTestUtils.login({
        app,
        client: bankAccount.owner,
      })

      const overrides = [{ account: null }, { account: undefined }]

      const responses = await Promise.all(
        overrides
          .map(override => ({ ...bankAccount, ...override }))
          .map(host =>
            request(app)
              .post("/api/v1/bank_accounts")
              .set("Authorization", token)
              .send(host)
          )
      )

      for (const response of responses) {
        expect(response.status).toBe(400)
        expect(response.body).toEqual([
          { message: "A conta deve ser informado" },
        ])
      }
    })

    test("when all validation passes, should create a bank account", async () => {
      const bankAccount = await factory.build(BankAccount)

      const token = await authTestUtils.login({
        app,
        client: bankAccount.owner,
      })

      const response = await request(app)
        .post("/api/v1/bank_accounts")
        .set("Authorization", token)
        .send(bankAccount)
        .expect(StatusCodes.CREATED)

      expect(response.body.data).toMatchObject({
        bank: bankAccount.bank,
        agency: bankAccount.agency,
        account: bankAccount.account,
        owner: {
          id: bankAccount.owner.id,
        },
      })
    })
  })
})
