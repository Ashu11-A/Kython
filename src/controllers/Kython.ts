import { cpus } from 'os'
import { Protocol, type CombinedRequest } from '../types/driver'
import { Runtime } from '../types/global.d'
import type { KythonHandler, KythonMethod, KythonParams } from '../types/kython'
import type { MethodParams } from '../types/router'
import { Driver } from './Drivers'
import { KythonResponse } from './Response'
import { Router } from './Router'

export class Kython<RunTyped extends Runtime, const in out Prototypes extends Protocol[] = [Protocol.HTTP]> {
  public protocols: Prototypes
  public readonly drivers = new Map<Prototypes[number], Driver<RunTyped, Prototypes[number]>>()
  private readonly multithreads: boolean = true
  public readonly threads: number = (typeof navigator !== 'undefined') ? navigator.hardwareConcurrency : cpus().length

  constructor(params?: KythonParams<RunTyped, Prototypes>) {
    this.protocols = (params?.protocols ?? [Protocol.HTTP]) as Prototypes
  }
 
  get: KythonMethod<Protocol.HTTP> = (path, func) => this.setRouter(path, 'get', func)
  post: KythonMethod<Protocol.HTTP> = (path, func) => this.setRouter(path, 'post', func)
  put: KythonMethod<Protocol.HTTP> = (path, func) => this.setRouter(path, 'put', func)
  patch: KythonMethod<Protocol.HTTP> = (path, func) => this.setRouter(path, 'patch', func)
  delete: KythonMethod<Protocol.HTTP> = (path, func) => this.setRouter(path, 'delete', func)
  socket: KythonMethod<Protocol.NET> = (path, func) => this.setRouter(path, 'socket', func)

  listen ({ port, hostname }: { port: number, hostname?: string }, callback?: (port: number, hostname?: string) => void) {
    this.protocols.forEach((protocol) => {
      this.drivers.set(protocol, Driver.getDriver(protocol))
    })

    Array.from(this.drivers.values()).forEach((driver) => driver.listen({ port, hostname }, this.onRequest, this))
  
    if (callback) callback(port, hostname)
  }

  async onRequest (request: CombinedRequest, response?: KythonResponse): Promise<Response> {
    if (!request.url) return new Response('')

    const content = new KythonResponse()

    switch (request.method as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') {
    case 'GET': {
      await Router.all.get(new URL(request.url).pathname)?.methods.get?.(request, response ?? content)
      break
    }
    case 'POST': {
      await Router.all.get(new URL(request.url).pathname)?.methods.post?.(request, response ?? content)
      break
    }
    case 'PUT': {
      await Router.all.get(new URL(request.url).pathname)?.methods.put?.(request, response ?? content)
      break
    }
    case 'PATCH': {
      await Router.all.get(new URL(request.url).pathname)?.methods.patch?.(request, response ?? content)
      break
    }
    case 'DELETE': {
      await Router.all.get(new URL(request.url).pathname)?.methods.delete?.(request, response ?? content)
      break
    }
    }
    
    return content.response
  }

  public setRouter<
    Methods extends MethodParams<Prototypes>,
    RouterProtocols extends Protocol[] = Prototypes,
  > (router: Router<Methods, RouterProtocols>): Kython<RunTyped, RouterProtocols>
  public setRouter<Prototype extends Protocol>(path: string, method: keyof MethodParams, func: KythonHandler<Prototype>): void

  public setRouter(...args: unknown[]): unknown {
    if (typeof args[0] === 'object') {
      const [router] = args as [Router<MethodParams<Prototypes>, Protocol[]>]
      const protocols = new Set<Protocol>()
    
      router.protocols.forEach((protocol) => {
        protocols.add(protocol)
        if (protocol === Protocol.NET) protocols.add(Protocol.HTTP)
      })
  
      this.protocols.forEach((protocol) => {
        protocols.add(protocol)
      })

      this.protocols = Array.from(protocols.values()) as Prototypes
      return this as unknown as Kython<RunTyped, Protocol[]>
    } else if (typeof args[0] === 'string') {
      const [path, method, func] = args as [string, keyof MethodParams, KythonHandler<Protocol>]
      const router = Router.all.get(path)
    
      if (!router) {
        new Router ({
          path,
          methods: { [method]: func }
        })
        return
      }
      switch (method) {
      case 'socket': {
        router.methods.socket = func as KythonHandler<Protocol.NET>
        break
      }
      case 'get': {
        router.methods.get = func as KythonHandler<Protocol.HTTP>
        break
      }
      case 'post': {
        router.methods.post = func as KythonHandler<Protocol.HTTP>
        break
      }
      case 'put': {
        router.methods.put = func as KythonHandler<Protocol.HTTP>
        break
      }
      case 'patch': {
        router.methods.patch = func as KythonHandler<Protocol.HTTP>
        break
      }
      case 'delete': {
        router.methods.delete = func as KythonHandler<Protocol.HTTP>
        break
      }
      }
    }
  }
}
