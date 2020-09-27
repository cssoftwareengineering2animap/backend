/* eslint-disable @typescript-eslint/no-use-before-define */
import * as faker from "faker"
import moment from "moment"
import { User } from "../../../domain/entities/user_entity"
import { Pet } from "../../../domain/entities/pet_entity"
import { Rating } from "../../../domain/entities/rating_entity"
import { File } from "../../../domain/entities/file_entity"

const entityFactoryMap = new Map()

entityFactoryMap.set(User, (props?: Partial<User>) => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  phone: faker.phone.phoneNumberFormat(0).replace(/-/g, ""),
  ...props,
}))

entityFactoryMap.set(Pet, (props?: Partial<Pet>) => ({
  name: faker.name.firstName(),
  birthday: moment(faker.date.past()).format("YYYY-MM-DD"),
  sex: faker.random.arrayElement(["male", "female"]),
  type: faker.random.alphaNumeric(10),
  ...props,
}))

entityFactoryMap.set(File, (props?: Partial<File>) => ({
  name: faker.random.alphaNumeric(16),
  key: faker.random.alphaNumeric(16),
  url: faker.internet.url(),
  displayOrder: faker.random.number({ min: 0, max: 999 }),
  ...props,
}))

entityFactoryMap.set(Rating, async (props?: Partial<Rating>) => ({
  stars: faker.random.number({ min: 0, max: 5 }),
  user: await create(User),
  grader: await create(User),
  pet: await create(Pet),
  ...props,
}))

export const build = async <T>(entity: T, props?: unknown) => {
  const entityFactory = entityFactoryMap.get(entity)
  if (!entityFactory) {
    throw new Error(`entity ${entity} is not registered`)
  }

  return entityFactory(props)
}

export const create = async <U, P, T extends new (...args: U[]) => P>(
  entity: T,
  props?: unknown
) => {
  const data = await build(entity, props)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instance: InstanceType<T> = await (entity as any).create(data).save()

  if (data.password) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(instance as any).password = data.password
  }

  return instance
}
