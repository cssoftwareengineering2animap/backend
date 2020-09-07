import { Context } from "./context"

declare module "express-serve-static-core" {
  interface Request {
    context: Context
  }
}
