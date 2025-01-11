import type { Server as BunServer } from 'bun'
import type { Server as HttpServer } from 'http'
import type { Driver } from '../controllers/Drivers'
import type { Kython } from '../controllers/Kython'
import type { KythonResponse } from '../controllers/Response'
import type { CustomRequest } from '../handlers/Request'
import type { WebSocketClient } from '../handlers/WebSocketClient'
import type { WebSocketServer } from '../handlers/WebSocketServer'
import type { Runtime } from './global'

export enum Protocol {
    HTTP = 1,
    NET = 2
}

export type DriverEvents<Prototype extends Protocol>= {
    ready: [Driver<typeof globalThis.runtime, Prototype>]
}

export type CombinedRequest = CustomRequest | Request;

export type DriverOptions<Prototype extends Protocol, RunTyped extends Runtime> = {
    name: string
    protocol: Prototype
    listen: ({
      port,
      hostname
    }: {port: number, hostname?: string},
    onRequest: Prototype extends Protocol.NET
    ? (client: WebSocketClient, server: WebSocketServer) => void
    : (request: CombinedRequest, response?: KythonResponse) => Promise<Response> | Response,
    kython: Kython<Runtime>
    ) => Prototype extends Protocol.HTTP
    ? (
        RunTyped extends Runtime.Bun
        ? BunServer
        : RunTyped extends Runtime.Deno
        ? Deno.HttpServer<Deno.NetAddr>
        : HttpServer
    )
    : Prototype extends Protocol.NET
    ? WebSocketServer
    : never
}