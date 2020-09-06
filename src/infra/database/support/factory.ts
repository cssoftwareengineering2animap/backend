import * as faker from "faker"
import * as bcrypt from "bcrypt"
import { User } from "../../../domain/entities/user_entity"

const entityFactoryMap = new Map()

entityFactoryMap.set(User, () => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: faker.phone.phoneNumberFormat(0).replace(/-/g, ""),
}))

export const build = async (entity: unknown) => {
  const entityFactory = await entityFactoryMap.get(entity)
  if (!entityFactory) {
    throw new Error(`entity ${entity} is not registered`)
  }

  return entityFactory()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const create = (entity: any) =>
  build(entity).then(data => entity.create(data).save())
