import { startHttpServer, startSocketServer } from "./presentation/rest/server"

startSocketServer()

startHttpServer()
  .then(({ port }) => console.log(`Listening on port ${port}`))
  .catch(console.error)
