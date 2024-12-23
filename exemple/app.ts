import { Kython, Router } from '../src/index'

const server = new Kython()

server.get('/', (_request, response) => {
  response.send('Hello world')
})

new Router({ 
  path: '/exemple',
  methods: {
    get(_request, response) {
      response.json({ hello: 'world' })
    }
  }
})

server.listen(3000, '0.0.0.0')
