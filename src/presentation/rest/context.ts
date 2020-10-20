import { Pagination } from "../../core/types/pagination"
import { Host } from "../../domain/entities/host_entity"
import { User } from "../../domain/entities/user_entity"

export interface Context {
  user: User
  host: Host
  pagination: Pagination
}
