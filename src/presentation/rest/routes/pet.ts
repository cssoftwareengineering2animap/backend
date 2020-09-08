import { Router } from "express"
import { container } from "tsyringe"
import { withErrorHandler } from "../utils/with_error_handler"
import { authRequired } from "../middlewares/auth_required_middleware"
import { PetController } from "../controllers/http/pet/pet_controller"

export const router = Router()

const petController = container.resolve(PetController)

router.get(
  "/v1/:user_id/pets",
  authRequired,
  withErrorHandler(petController.getPets)
)

router.post(
  "/v1/:user_id/pets",
  authRequired,
  withErrorHandler(petController.createPet)
)
