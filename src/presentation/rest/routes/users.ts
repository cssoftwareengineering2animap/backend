import { Router } from "express"
import { container } from "tsyringe"
import { UserController } from "../controllers/user/user_controller"

export const router = Router()

const userController = container.resolve(UserController)

router.post("v1/users", userController.store)
