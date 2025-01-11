import { Protocol } from '../types/driver'
import type { InferProtocols, MethodParams } from '../types/router'

export class Router<
  Methods extends MethodParams<Protocols>,
  Protocols extends Protocol[] = InferProtocols<Methods>
> {
  static all = new Map<string, Router<MethodParams<Protocol[]>, Protocol[]>>()
  public readonly name?: string
  public readonly description?: string
  public readonly path: string
  public readonly methods: Methods
  public readonly protocols: Protocols

  constructor(params: {
    name?: string
    description?: string
    path: string
    methods: Methods
  }) {
    this.name = params.name
    this.description = params.description
    this.path = params.path
    this.methods = params.methods
    this.protocols = this.inferProtocols(params.methods) as Protocols

    Router.all.set(this.path, this)
  }

  private inferProtocols(methods: Methods): Protocol[] {
    const protocols: Protocol[] = []
    for (const key in methods) {
      if (['delete', 'patch', 'post', 'put', 'get'].includes(key)) {
        protocols.push(Protocol.HTTP)
      }
      if (key === 'socket') {
        protocols.push(Protocol.NET)
      }
    }
    return protocols
  }
}