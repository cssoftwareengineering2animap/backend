import { User } from "../../../domain/entities/user_entity"

type TypeOrmActiveRecord = {
  create: <T>(props: object) => T
}

const entityFactoryMap = new Map()

entityFactoryMap.set(User, () => ({}))

export const build = async <T>(entity: T) => {
  const entityFactory = await entityFactoryMap.get(entity)
  if (!entityFactory) {
    throw new Error(`entity ${entity} is not registered`)
  }

  return entityFactory()
}

export const create = (entity: TypeOrmActiveRecord) =>
  build(entity).then(entity.create)
