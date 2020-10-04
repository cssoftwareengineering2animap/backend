import request from "supertest"
import { Express } from "express"
import { User } from "../../src/domain/entities/user_entity"

interface Props {
  app: Express
  user: Pick<User, "email" | "password">
}

export const login = ({ app, user }: Props) =>
  request(app)
    .post("/api/v1/login")
    .send(user)
    .expect(200)
    .then(response => response.body.data.token)
