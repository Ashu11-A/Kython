import type { Driver } from '../controllers/Drivers'
import type { KythonResponse } from '../controllers/Response'
import type { WebSocketClient } from '../handlers/WebSocketClient'
import type { WebSocketServer } from '../handlers/WebSocketServer'
import type { CombinedRequest, Protocol } from './driver'
import type { Runtime } from './global'


export type KythonHandler<Prototype extends Protocol> = 
Prototype extends Protocol.HTTP
  ? (
      request: CombinedRequest,
      response: KythonResponse
    ) => Promise<void> | void
  : (
    client: WebSocketClient,
    server: WebSocketServer
  ) => void

export type KythonMethod<Prototype extends Protocol>= (
  path: string,
  func: KythonHandler<Prototype>
) => void

export type KythonParams<RunTyped extends Runtime, Prototypes extends Protocol[]> = {

  /**
   * Whether to enable a multithreaded system using Workers.
   *
   * @type {boolean | undefined}
   * @default true
   */
  multithreads?: boolean

  /**
   * Number of threads that will be instantiated on the server
   *
   * @type {number | undefined}
   */
  threads?: number

  /**
   * The communication protocol to use. Accepted values include HTTP, NET, and TLS.
   *
   * @type {Prototype | undefined}
   * @default [Protocol.HTTP]
   */
  protocols?: Prototypes

  /**
   * The communication driver. Typically, you don't need to modify this directly
   * it is inferred based on the protocol.
   *
   * @type {Drive<Prototype> | undefined}
   */
  driver?: Driver<RunTyped, Prototypes[number]>
}
