import { Router } from "express"
import { container } from "tsyringe"
import { UserController } from "../controllers/user/user_controller"
import { withErrorHandler } from "../utils/with_error_handler"

export const router = Router()

const userController = container.resolve(UserController)

router.post("/v1/users", withErrorHandler(userController.createUser))
