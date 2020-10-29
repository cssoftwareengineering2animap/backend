import { Pagination } from "../../core/types"
import { User, Host } from "../../domain/entities"

export interface Context {
  user: User
  host: Host
  pagination: Pagination
}
