import { createConnection, getConnection, getConnectionOptions } from "typeorm"
import { env } from "../../../config/env"

export const create = () =>
  getConnectionOptions(env.NODE_ENV)
    .then(options => ({
      ...options,
      name: "default",
    }))
    .then(createConnection)

export const close = () => getConnection().close()

export const clear = async () => {
  const connection = getConnection()
  const entities = connection.entityMetadatas

  return Promise.all(
    entities.map(entity => {
      const repository = connection.getRepository(entity.name)
      return repository.query(`DELETE FROM ${entity.tableName}`)
    })
  )
}
