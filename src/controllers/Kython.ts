import { Protocol } from '../types/driver'
import { Runtime } from '../types/global.d'
import type { KythonHandler, KythonMethod, KythonParams } from '../types/kython'
import type { MethodKeys } from '../types/router'
import { Driver } from './Drivers'
import type { KythonRequest } from './Request'
import { KythonResponse } from './Response'
import { Router } from './Router'

export class Kython<RunTyped extends Runtime, Prototype extends Protocol = Protocol.HTTP> {
  public readonly protocol: Prototype
  public readonly driver: Driver<Prototype, RunTyped>
  private readonly multithreads: boolean = true
  public readonly threads: number = navigator.hardwareConcurrency

  constructor(params?: KythonParams<Prototype>) {
    this.protocol = (params?.protocol ?? Protocol.HTTP) as Prototype
    this.driver = Driver.getDriver(this.protocol)
  }
 
  get: KythonMethod = (path, func) => this.setRouter(path, 'get', func)
  post: KythonMethod = (path, func) => this.setRouter(path, 'post', func)
  put: KythonMethod = (path, func) => this.setRouter(path, 'put', func)
  patch: KythonMethod = (path, func) => this.setRouter(path, 'patch', func)
  delete: KythonMethod = (path, func) => this.setRouter(path, 'delete', func)

  listen (port: number, hostname?: string) {
    this.driver.listen({ port, hostname }, this.onRequest)
  }

  async onRequest (request: KythonRequest, response?: KythonResponse): Promise<Response> {
    if (!request.link) return new Response('')

    const content = new KythonResponse()
    await Router.all.get(request.link.pathname)?.[request.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE']?.(request, response ?? content)
    
    return content.response
  }
  
  private setRouter (path: string, method: MethodKeys, func: KythonHandler) {
    const router = Router.all.get(path)

    if (!router) {
      new Router ({
        path,
        methods: { [method]: func }
      })
      return
    }
    router.methods[method] = func
  }
}
