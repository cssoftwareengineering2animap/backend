import { Router } from "express"
import { container } from "tsyringe"
import multer from "multer"
import { UserController } from "../controllers/http/user/user_controller"
import { authRequired } from "../middlewares/auth_required_middleware"
import { withErrorHandler } from "../utils/with_error_handler"
import { multerConfig } from "../../../config/multer"

const upload = multer(multerConfig)

export const router = Router()

const userController = container.resolve(UserController)

router.post("/v1/users", withErrorHandler(userController.createUser))

router.post(
  "/v1/users/pictures",
  authRequired,
  upload.single("file"),
  withErrorHandler(userController.addPicture)
)
