import request from "supertest"
import { Express } from "express"
import { User } from "../../src/domain/entities/user_entity"
import { Host } from "../../src/domain/entities/host_entity"

interface Props {
  app: Express
  client: Pick<User, "email" | "password"> | Pick<Host, "email" | "password">
}

export const login = ({ app, client }: Props) =>
  request(app)
    .post("/api/v1/login")
    .send(client)
    .expect(200)
    .then(response => response.body.data.token)
