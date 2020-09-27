import { injectable } from "tsyringe"
import { getManager } from "typeorm"
import { Rating } from "../../../entities/rating_entity"
import { User } from "../../../entities/user_entity"
import { RateUserDto } from "./rate_user.dto"

@injectable()
export class RateUserUseCase {
  execute = ({ user, ...data }: RateUserDto) =>
    getManager().transaction(async transactionalEntityManager => {
      const rating = Rating.create(data)

      await transactionalEntityManager.save(rating)

      await transactionalEntityManager
        .createQueryBuilder()
        .relation(User, "ratings")
        .of(user)
        .add(rating)

      return rating
    })
}
