import { Router } from "express"
import { container } from "tsyringe"
import { authRequired } from "../middlewares/auth_required_middleware"
import { withErrorHandler } from "../utils/with_error_handler"
import { RatingController } from "../controllers/http/rating/rating_controller"

export const router = Router()

const ratingController = container.resolve(RatingController)

router.post(
  "/v1/users/:user_id/ratings",
  authRequired,
  withErrorHandler(ratingController.rateUser)
)
