import type { Server as BunServer } from 'bun'
import type { Server as HttpServer } from 'http'
import type { Server as NetServer } from 'net'
import type { Server as TlsServer } from 'tls'
import type { Driver } from '../controllers/Drivers'
import type { Runtime } from './global'
import type { KythonRequest } from '../controllers/Request'
import type { KythonResponse } from '../controllers/Response'

export enum Protocol {
    HTTP = 'http',
    NET = 'net',
    TLS = 'tls'
}

export type DriverOptions<Prototype extends Protocol, RunTyped extends Runtime> = {
    name: string
    protocol: Prototype
    listen: ({
      port,
      hostname
    }: {port: number, hostname?: string},
    onRequest: (request: KythonRequest, response?: KythonResponse) => Promise<Response> | Response
    ) => Prototype extends Protocol.HTTP
    ? (
        RunTyped extends Runtime.Bun
        ? BunServer
        : RunTyped extends Runtime.Deno
        ? Deno.HttpServer<Deno.NetAddr>
        : HttpServer
    )
    : Prototype extends Protocol.TLS
    ? TlsServer
    : Prototype extends Protocol.NET
    ? NetServer
    : never
}

export interface DriverEvents<Prototype extends Protocol>{
    ready: (driver: Driver<Prototype, typeof globalThis.runtime>) => void
}

export declare interface Drive<Prototype extends Protocol> {
    on<U extends keyof DriverEvents<Prototype>>(event: U, listener: DriverEvents<Prototype>[U]): this
    emit<U extends keyof DriverEvents<Prototype>>(event: U, listener: DriverEvents<Prototype>[U]): boolean
}