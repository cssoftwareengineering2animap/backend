import request from "supertest"
import moment from "moment"

import * as factory from "../../../../../../infra/database/support/factory"
import * as connection from "../../../../../../infra/database/support/connection"
import * as authTestUtils from "../../../../../../../test/utils/auth"
import { app } from "../../../../server"
import { Tour, TourStatus } from "../../../../../../domain/entities/tour_entity"

describe("Tour controller functional test suite", () => {
  beforeAll(connection.create)
  beforeEach(connection.clear)

  describe("POST api/v1/pets/:petId/tours", () => {
    describe("As a host", () => {
      test("when tour scheduled date is in the past, should return an error message", async () => {
        const tour = await factory.build(Tour, {
          scheduledFor: moment().subtract({ days: 1 }).format(),
        })

        const token = await authTestUtils.login({ app, client: tour.host })

        const response = await request(app)
          .post(`/api/v1/pets/${tour.pet.id}/tours`)
          .set("Authorization", token)
          .send({ scheduledFor: tour.scheduledFor })
          .expect(400)

        expect(response.body).toEqual([
          {
            message:
              "Não é possível agendar passeios para datas anteriores ao dia de hoje",
          },
        ])
      })

      test("when all validation passes, should create a tour with pending status", async () => {
        const tour = await factory.build(Tour)

        const token = await authTestUtils.login({ app, client: tour.host })

        const response = await request(app)
          .post(`/api/v1/pets/${tour.pet.id}/tours`)
          .set("Authorization", token)
          .send({ scheduledFor: tour.scheduledFor })
          .expect(201)

        expect(response.body.data).toMatchObject({
          status: TourStatus.pending,
          host: {
            id: tour.host.id,
          },
        })
      })
    })

    describe("As an user", () => {
      test.only(`when a tour is denied, its status should change to ${TourStatus.denied}`, async () => {
        const tour = await factory.create(Tour)

        const token = await authTestUtils.login({ app, client: tour.pet.owner })
        console.log("aaaaa", token)

        const response = await request(app)
          .post(`/api/v1/tours/${tour.id}/denied_tours`)
          .set("Authorization", token)
          .expect(200)

        console.log("aaaa", response.body)
      })
    })
  })
})
