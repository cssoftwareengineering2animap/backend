import { Router } from "express"
import { container } from "tsyringe"
import { withErrorHandler } from "../utils/with_error_handler"
import { AuthController } from "../controllers/http/auth/auth_controller"

export const router = Router()

const authController = container.resolve(AuthController)

router.post("/v1/login", withErrorHandler(authController.login))
