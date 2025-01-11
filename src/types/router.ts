import type { KythonResponse } from '../controllers/Response'
import type { WebSocketClient } from '../handlers/WebSocketClient'
import type { WebSocketServer } from '../handlers/WebSocketServer'
import type { CombinedRequest, Protocol } from './driver'

export type MethodHTTPKeys = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type MethodHTTP = {
  get?: (request: CombinedRequest, response: KythonResponse) => Promise<void> | void
  post?: (request: CombinedRequest, response: KythonResponse) => Promise<void> | void
  put?: (request: CombinedRequest, response: KythonResponse) => Promise<void> | void
  patch?: (request: CombinedRequest, response: KythonResponse) => Promise<void> | void
  delete?: (request: CombinedRequest, response: KythonResponse) => Promise<void> | void
}

export type MethodSocket = {
  socket?: (
    client: WebSocketClient,
    server: WebSocketServer
  ) => Promise<void> | void
}

export type ExclusiveMethods =
  | (MethodSocket & MethodHTTP & { get?: never })
  | (MethodHTTP & { socket?: never });

export type MethodParams<Prototypes extends Protocol[] = []> =
  Prototypes[number] extends Protocol.HTTP | Protocol.NET
    ? Prototypes[number] extends Protocol.HTTP
      ? Prototypes[number] extends Protocol.NET
        ? ExclusiveMethods
        : MethodHTTP
      : MethodSocket
    : ExclusiveMethods

export type InferProtocols<Methods extends MethodParams<Protocol[]>> = (
    Methods extends MethodSocket ? [Protocol.NET] : []
  ) extends infer P1
    ? P1 extends Protocol[]
      ? (Methods extends MethodHTTP ? [...P1, Protocol.HTTP] : P1)
      : []
    : []

export type RouterParams<Methods extends MethodParams<Protocol[]>> = {
  name?: string
  description?: string
  path: string
  methods: Methods
}
