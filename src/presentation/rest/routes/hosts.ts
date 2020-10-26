import { Router } from "express"
import { container } from "tsyringe"
import { BankAccountController } from "../controllers/http/host/bank_account/bank_account_controller"
import { HostController } from "../controllers/http/host/host_controller"
import { authRequired } from "../middlewares/auth_required_middleware"
import { withErrorHandler } from "../utils/with_error_handler"

export const router = Router()

const hostController = container.resolve(HostController)
const bankAccountController = container.resolve(BankAccountController)

router.post("/v1/hosts", withErrorHandler(hostController.createHost))

router.post(
  "/v1/bank_accounts",
  authRequired,
  withErrorHandler(bankAccountController.createBankAccount)
)

router.post(
  `/v1/hosts/:hostId/blockings`,
  authRequired,
  withErrorHandler(hostController.blockHost)
)
