/* eslint-disable */

import "reflect-metadata"
import * as container from "./container"

container.register()

import { startHttpServer, startSocketServer } from "./presentation/rest"

startSocketServer()

startHttpServer()
  .then(({ port }) => console.log(`Listening on port ${port}`))
  .catch(console.error)
