import { type DropArgument } from 'net'
import type { WebSocketClient } from '../handlers/WebSocketClient'
import type { Kython } from '../controllers/Kython'
import type { Runtime } from './global'

export type WebSocketEvents = {
    listening: []
    close: []
    error: [Error]
    drop: [DropArgument | undefined]
    'client.close': [WebSocketClient]
    'client.connection': [WebSocketClient]
    'client.message': [string, WebSocketClient]
}

export type WebSocketOptions= {
    port: number
    hostname?: string
    /**
     * If there is a connection request,
     * and there is no actual connection,
     * the client will be dropped.
     * 
     * @default 10_000
     */
    timeoutConection?: number
    kython: Kython<Runtime>
}