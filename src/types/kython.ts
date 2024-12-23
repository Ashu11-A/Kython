import type { KythonRequest } from '../controllers/Request'
import type { KythonResponse } from '../controllers/Response'
import type { Drive, Protocol } from './driver'

export type KythonHandler = (
  request: KythonRequest,
  response: Omit<KythonResponse, 'response'>
) => Promise<void> | void

export type KythonMethod = (
  path: string,
  func: KythonHandler
) => void

export type KythonParams<Prototype extends Protocol> = {

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
   * @default Protocol.HTTP
   */
  protocol?: Prototype

  /**
   * The communication driver. Typically, you don't need to modify this directly
   * it is inferred based on the protocol.
   *
   * @type {Drive<Prototype> | undefined}
   */
  driver?: Drive<Prototype>
}
