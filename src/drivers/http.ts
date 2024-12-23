import { createServer } from 'http'
import { Driver } from '../controllers/Drivers'
import { Protocol } from '../types/driver'
import { Runtime } from '../types/global.d'
import { KythonRequest } from '../controllers/Request'
import { KythonResponse } from '../controllers/Response'

export default new Driver({
  name: 'http',
  protocol: Protocol.HTTP,
  listen({ port, hostname }, onRequest) {
    switch (runtime) {
    case Runtime.Bun: {
      return Bun.serve({ port, hostname, reusePort: true, fetch: async (request) => onRequest(new KythonRequest(request)) })
    }
    case Runtime.Deno: {
      return Deno.serve({ port, hostname }, async (request) => onRequest(new KythonRequest(request)))
    }
    case Runtime.Node: {
      return createServer(
        (request) => onRequest(new KythonRequest(request), new KythonResponse())
      ).listen(port)
    }
    }
  },
})
