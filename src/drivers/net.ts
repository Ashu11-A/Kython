import { createServer } from 'net'
import { Driver } from '../controllers/Drivers'
import { Protocol } from '../types/driver'

export default new Driver({
  name: 'net',
  protocol: Protocol.NET,
  listen({ port, hostname }) {
    return createServer().listen(port, hostname) 
  }
})
