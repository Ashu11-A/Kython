import type { MethodParams, RouterParams } from '../types/router'

export class Router {
  static all = new Map<string, Router>()

  public readonly name?: string
  public readonly description?: string
  public readonly path: string
  public readonly methods: MethodParams
  
  public readonly GET
  public readonly POST
  public readonly PUT
  public readonly PATCH
  public readonly DELETE

  constructor (params: RouterParams) {
    if (params.name) this.name = params.name
    if (params.description) this.description = params.description
    this.path = params.path
    this.methods = params.methods
    
    this.GET = params.methods.get
    this.POST = params.methods.post
    this.PUT = params.methods.put
    this.PATCH = params.methods.patch
    this.DELETE = params.methods.delete

    Router.all.set(this.path, this)
  }
}