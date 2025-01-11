import { Kython, Router } from '../src/index'

const server = new Kython().setRouter(
  new Router({ 
    path: '/',
    methods: {
      get(_request, response) {
        response.status(200).send('Hello world')
      }
    }
  })
).setRouter(
  new Router({ 
    path: '/ws',
    methods: {
      socket(client) {
        client.send('Hello world')
      },
    }
  })
)

server.get('/test', (request, response) => {
  response.json({ hello: 'world' })
})

server.listen({
  port: 3000,
  hostname: 'localhost'
}, (port, hostname) => {
  console.log(`Server listening at http://${hostname ?? 'localhost'}:${port}`)
  console.log(`Enabled protocols: ${
    server.drivers.values()
      .toArray()
      .map((driver) => driver.name)}`)
})
