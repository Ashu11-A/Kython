import { Driver } from '../controllers/Drivers'
import { WebSocketServer } from '../handlers/WebSocketServer'
import { Protocol } from '../types/driver'

export default new Driver({
  name: 'net',
  protocol: Protocol.NET,
  listen({ port, hostname }, onRequest, kython) {
    const server = new WebSocketServer({ port: 6060, hostname, kython })
    console.log(port, hostname)

    server.on('client.connection', (client) => {
      onRequest(client, server)
    })

    return server
  }
})
