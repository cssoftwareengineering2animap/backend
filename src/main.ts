import startServer from "./presentation/rest/server"

startServer()
  .then(({ port }) => console.log(`Listening on port ${port}`))
  .catch(console.error)
