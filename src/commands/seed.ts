import { createConnection, getConnectionOptions } from "typeorm"

import { join } from "path"
import { readdir } from "fs"
import { promisify } from "util"
import { env } from "process"

async function seed(): Promise<void> {
  const connectionOptions = await getConnectionOptions(env.NODE_ENV)
  const connection = await createConnection({
    ...connectionOptions,
    name: "default",
  })

  const files = await promisify(readdir)(__dirname)

  const seeders = await Promise.all(
    files
      .filter(name => !/Seed.ts/.test(name))
      .map(name => import(join(__dirname, name)))
  )

  await Promise.all(seeders.map(seeder => seeder.default()))

  await connection.close()
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
seed()
