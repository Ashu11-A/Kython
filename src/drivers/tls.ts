import { createServer } from 'tls'
import { Driver } from '../controllers/Drivers'
import { Protocol } from '../types/driver'

export default new Driver({
  name: 'tls',
  protocol: Protocol.TLS,
  listen({ port, hostname }) {
    return createServer().listen(port, hostname)
  }
})
