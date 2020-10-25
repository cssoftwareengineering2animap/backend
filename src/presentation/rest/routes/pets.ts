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
  "/v1/pets/feed",
  authRequired,
  withErrorHandler(petController.getPetsFeed)
)

router.get(
  "/v1/users/:userId/pets",
  authRequired,
  withErrorHandler(petController.getUserPets)
)

router.post("/v1/pets", authRequired, withErrorHandler(petController.createPet))

router.post(
  "/v1/pets/:petId/pictures",
  authRequired,
  upload.single("file"),
  withErrorHandler(petController.addPicture)
)
