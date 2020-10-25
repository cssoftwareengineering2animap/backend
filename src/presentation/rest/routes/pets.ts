import { Router } from "express"
import { container } from "tsyringe"
import multer from "multer"
import { withErrorHandler } from "../utils/with_error_handler"
import { authRequired } from "../middlewares/auth_required_middleware"
import { PetController } from "../controllers/http/pet/pet_controller"
import { multerConfig } from "../../../config/multer"
import { TourController } from "../controllers/http/pet/tour/tour_controller"

export const router = Router()

const upload = multer(multerConfig)

const petController = container.resolve(PetController)
const tourController = container.resolve(TourController)

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

router.post(
  "/v1/pets/:petId/tours",
  authRequired,
  withErrorHandler(tourController.createTour)
)

router.post(
  "/v1/tours/:tourId/denied_tours",
  authRequired,
  withErrorHandler(tourController.denyTour)
)

router.post(
  "/v1/tours/:tourId/accepted_tours",
  authRequired,
  withErrorHandler(tourController.acceptTour)
)

router.post(
  "/v1/tours/:tourId/completed_tours",
  authRequired,
  withErrorHandler(tourController.completeTour)
)

router.get("/v1/tours", authRequired, withErrorHandler(tourController.getTours))
