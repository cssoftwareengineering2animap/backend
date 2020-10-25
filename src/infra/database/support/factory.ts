/* eslint-disable @typescript-eslint/no-use-before-define */
import * as faker from "faker"
import { br as fakerBr } from "faker-br"
import moment from "moment"
import { User } from "../../../domain/entities/user_entity"
import { Pet } from "../../../domain/entities/pet_entity"
import { Rating } from "../../../domain/entities/rating_entity"
import { File } from "../../../domain/entities/file_entity"
import { Host } from "../../../domain/entities/host_entity"
import { BankAccount } from "../../../domain/entities/bank_account_entity"
import { Tour, TourStatus } from "../../../domain/entities/tour_entity"

const entityFactoryMap = new Map()

entityFactoryMap.set(BankAccount, async (props?: Partial<BankAccount>) => {
  const owner = await create(Host)

  return {
    bank: faker.finance.accountName(),
    account: faker.finance.account(),
    agency: faker.finance.accountName(),
    owner,
    ...props,
  }
})

entityFactoryMap.set(User, (props?: Partial<User>) => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...props,
}))

entityFactoryMap.set(Host, (props?: Partial<Host>) => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  cpf: fakerBr.cpf(),
  ...props,
}))

entityFactoryMap.set(Pet, async (props?: Partial<Pet>) => {
  const owner = await create(User)

  return {
    name: faker.name.firstName(),
    age: faker.random.number({ min: 0, max: 100 }),
    sex: faker.random.arrayElement(["male", "female"]),
    type: faker.random.alphaNumeric(10),
    observations: faker.lorem.sentence(),
    owner,
    ownerId: owner.id,
    ...props,
  }
})

entityFactoryMap.set(File, (props?: Partial<File>) => ({
  name: faker.random.alphaNumeric(16),
  key: faker.random.alphaNumeric(16),
  url: faker.internet.url(),
  displayOrder: faker.random.number({ min: 0, max: 999 }),
  ...props,
}))

entityFactoryMap.set(Rating, async (props?: Partial<Rating>) => {
  const user = await create(User)
  const grader = await create(User)
  const pet = await create(Pet, { owner: { id: user.id } })

  return {
    stars: faker.random.number({ min: 0, max: 5 }),
    user,
    grader,
    pet,
    ...props,
  }
})

entityFactoryMap.set(Tour, async (props?: Partial<Tour>) => {
  const host = await create(Host)
  const pet = await create(Pet)

  return {
    scheduledFor: moment(faker.date.future()).format("YYYY-MM-DD hh:mm:ss"),
    pet,
    host,
    status: TourStatus.pending,
    ...props,
  }
})

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
