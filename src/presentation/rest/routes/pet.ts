import { Router } from "express"
import { container } from "tsyringe"
import multer from "multer"
import { withErrorHandler } from "../utils/with_error_handler"
import { authRequired } from "../middlewares/auth_required_middleware"
import { PetController } from "../controllers/http/pet/pet_controller"
import { multerConfig } from "../../../config/multer"

export const router = Router()

const upload = multer(multerConfig)

const petController = container.resolve(PetController)

router.get(
  "/v1/users/:user_id/pets",
  authRequired,
  withErrorHandler(petController.getPets)
)

router.post(
  "/v1/users/:user_id/pets",
  authRequired,
  withErrorHandler(petController.createPet)
)

router.post(
  "/v1/users/:user_id/pets/:pet_id/pictures",
  authRequired,
  upload.single("file"),
  withErrorHandler(petController.addPicture)
)
