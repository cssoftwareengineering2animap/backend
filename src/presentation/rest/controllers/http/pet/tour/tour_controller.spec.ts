import request from "supertest"
import moment from "moment"

import { StatusCodes } from "http-status-codes"
import * as factory from "../../../../../../infra/database/support/factory"
import * as connection from "../../../../../../infra/database/support/connection"
import * as authTestUtils from "../../../../../../../test/utils/auth"
import { app } from "../../../../server"
import { Tour, TourStatus, User, Pet } from "../../../../../../domain/entities"

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
          .send(tour)
          .expect(StatusCodes.BAD_REQUEST)

        expect(response.body).toEqual([
          {
            message:
              "Não é possível agendar passeios para datas anteriores ao dia de hoje",
          },
        ])
      })

      test("when tour tip is less than 1, should return an error message", async () => {
        const tour = await factory.build(Tour, {
          tip: -10,
        })

        const token = await authTestUtils.login({ app, client: tour.host })

        const response = await request(app)
          .post(`/api/v1/pets/${tour.pet.id}/tours`)
          .set("Authorization", token)
          .send({ scheduledFor: tour.scheduledFor })
          .expect(StatusCodes.BAD_REQUEST)

        expect(response.body).toEqual([
          {
            message: "A gorjeta deve ser no mínimo 1 real",
          },
        ])
      })

      test("when all validation passes, should create a tour with pending status", async () => {
        const tour = await factory.build(Tour)

        const token = await authTestUtils.login({ app, client: tour.host })

        const response = await request(app)
          .post(`/api/v1/pets/${tour.pet.id}/tours`)
          .set("Authorization", token)
          .send(tour)
          .expect(StatusCodes.CREATED)

        expect(response.body.data).toMatchObject({
          status: TourStatus.pending,
          host: {
            id: tour.host.id,
          },
        })
      })
    })

    describe("As an user", () => {
      test(`should not be able to deny tours of pets that belong to other users`, async () => {
        const user = await factory.create(User)
        const pet = await factory.create(Pet, { owner: user })
        const tour = await factory.create(Tour, { pet })

        const userThatDoesntOwnTour = await factory.create(User)
        const token = await authTestUtils.login({
          app,
          client: userThatDoesntOwnTour,
        })

        await request(app)
          .post(`/api/v1/tours/${tour.id}/denied_tours`)
          .set("Authorization", token)
          .expect(StatusCodes.FORBIDDEN)
      })

      test(`when a tour is denied, it's status should change to ${TourStatus.denied}`, async () => {
        const user = await factory.create(User)
        const pet = await factory.create(Pet, { owner: user })
        const tour = await factory.create(Tour, { pet })

        const token = await authTestUtils.login({ app, client: user })

        const response = await request(app)
          .post(`/api/v1/tours/${tour.id}/denied_tours`)
          .set("Authorization", token)
          .expect(StatusCodes.OK)

        expect(response.body.data).toMatchObject({
          id: tour.id,
          status: TourStatus.denied,
        })
      })

      test(`should not be able to accept tours of pets that belong to other users`, async () => {
        const user = await factory.create(User)
        const pet = await factory.create(Pet, { owner: user })
        const tour = await factory.create(Tour, { pet })

        const userThatDoesntOwnTour = await factory.create(User)
        const token = await authTestUtils.login({
          app,
          client: userThatDoesntOwnTour,
        })

        await request(app)
          .post(`/api/v1/tours/${tour.id}/accepted_tours`)
          .set("Authorization", token)
          .expect(StatusCodes.FORBIDDEN)
      })

      test(`when a tour is accepted, it's status should change to ${TourStatus.accepted}`, async () => {
        const user = await factory.create(User)
        const pet = await factory.create(Pet, { owner: user })
        const tour = await factory.create(Tour, { pet })

        const token = await authTestUtils.login({ app, client: user })

        const response = await request(app)
          .post(`/api/v1/tours/${tour.id}/accepted_tours`)
          .set("Authorization", token)
          .expect(StatusCodes.OK)

        expect(response.body.data).toMatchObject({
          id: tour.id,
          status: TourStatus.accepted,
        })
      })

      test(`should not be able to complete tours of pets that belong to other users`, async () => {
        const user = await factory.create(User)
        const pet = await factory.create(Pet, { owner: user })
        const tour = await factory.create(Tour, { pet })

        const userThatDoesntOwnTour = await factory.create(User)
        const token = await authTestUtils.login({
          app,
          client: userThatDoesntOwnTour,
        })

        await request(app)
          .post(`/api/v1/tours/${tour.id}/completed_tours`)
          .set("Authorization", token)
          .expect(StatusCodes.FORBIDDEN)
      })

      test(`when a tour is completed, it's status should change to ${TourStatus.completed}`, async () => {
        const user = await factory.create(User)
        const pet = await factory.create(Pet, { owner: user })
        const tour = await factory.create(Tour, { pet })

        const token = await authTestUtils.login({ app, client: user })

        const response = await request(app)
          .post(`/api/v1/tours/${tour.id}/completed_tours`)
          .set("Authorization", token)
          .expect(StatusCodes.OK)

        expect(response.body.data).toMatchObject({
          id: tour.id,
          status: TourStatus.completed,
        })
      })

      test(`should be able to fetch a list of tours that my pets are involved in`, async () => {
        const user = await factory.create(User)
        const pet = await factory.create(Pet, { owner: user })
        const tour = await factory.create(Tour, { pet })

        const token = await authTestUtils.login({ app, client: user })

        const response = await request(app)
          .get(`/api/v1/tours`)
          .set("Authorization", token)
          .expect(StatusCodes.OK)

        expect(response.body.data).toMatchObject([
          {
            id: tour.id,
            status: tour.status,
            tip: tour.tip,
            host: {
              id: tour.host.id,
            },
            pet: {
              id: tour.pet.id,
            },
          },
        ])
      })
    })
  })
})
