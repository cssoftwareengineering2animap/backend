import * as faker from "faker"
import moment from "moment"
import { User } from "../../../domain/entities/user_entity"
import { Pet } from "../../../domain/entities/pet_entity"

const entityFactoryMap = new Map()

entityFactoryMap.set(User, () => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: faker.phone.phoneNumberFormat(0).replace(/-/g, ""),
}))

entityFactoryMap.set(Pet, () => ({
  name: faker.name.firstName(),
  birthday: moment(faker.date.past()).format("YYYY-MM-DD"),
  sex: faker.random.arrayElement(["male", "female"]),
  type: faker.random.alphaNumeric(10),
}))

export const build = async (entity: unknown) => {
  const entityFactory = entityFactoryMap.get(entity)
  if (!entityFactory) {
    throw new Error(`entity ${entity} is not registered`)
  }

  return entityFactory()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const create = async (entity: any) => {
  const data = await build(entity)

  const instance = await entity.create(data).save()

  if (data.password) {
    instance.password = data.password
  }

  return instance
}
