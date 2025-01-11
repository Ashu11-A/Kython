import { createServer } from 'http'
import { Driver } from '../controllers/Drivers'
import { KythonResponse } from '../controllers/Response'
import { CustomRequest } from '../handlers/Request'
import { Protocol } from '../types/driver'
import { Runtime } from '../types/global.d'

export default new Driver({
  name: 'http',
  protocol: Protocol.HTTP,
  listen({ port, hostname }, onRequest) {
    switch (runtime) {
    case Runtime.Bun: {
      return Bun.serve({ port, hostname, reusePort: true, fetch: async (request) => onRequest(request) })
    }
    case Runtime.Deno: {
      return Deno.serve({ port, hostname }, async (request) => onRequest(request))
    }
    case Runtime.Node: {
      return createServer(
        (request, response) => onRequest(new CustomRequest(request), new KythonResponse(response, request))
      ).listen(port)
    }
    }
  },
})
