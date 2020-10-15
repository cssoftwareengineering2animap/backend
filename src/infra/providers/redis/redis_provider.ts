import { singleton } from "tsyringe"
import Redis from "ioredis"
import * as R from "ramda"
import { connections } from "../../../config/redis"
import { ApplicationError } from "../../../core/errors/application_error"

@singleton()
export class RedisProvider {
  private redisConnections: Record<string, Redis.Redis>

  private currentConnection: Redis.Redis

  constructor() {
    this.createConnections()
  }

  private createConnections = () => {
    const redisInstances = connections.map(
      connection =>
        new Redis(Number(connection.port), connection.host, {
          password: connection.password,
        })
    )

    // eslint-disable-next-line prefer-destructuring
    this.currentConnection = redisInstances[0]

    this.redisConnections = Object.fromEntries(
      R.zip(connections, redisInstances).map(([connection, redis]) => [
        connection.name,
        redis,
      ])
    )
  }

  connection = (connection: string) => {
    const redisInstance = this.redisConnections[connection]
    if (!redisInstance) {
      throw new ApplicationError(`Unknown redis connection <${connection}>`)
    }

    this.currentConnection = redisInstance

    return this
  }

  del = (...keys: Redis.KeyType[]) => this.currentConnection.del(keys)

  get = (key: Redis.KeyType) => this.currentConnection.get(key)

  setex = (key: Redis.KeyType, seconds: number, value: Redis.ValueType) =>
    this.currentConnection.setex(key, seconds, value)
}
