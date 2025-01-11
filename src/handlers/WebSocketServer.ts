import net, { Server as NetServer } from 'net'
import { TypedEventEmitter } from '../controllers/EventEmitter'
import type { WebSocketEvents, WebSocketOptions } from '../types/websocket'
import { WebSocketClient } from './WebSocketClient'

export class WebSocketServer extends TypedEventEmitter<WebSocketEvents> {
  private server: NetServer
  static clients = new Map<string, WebSocketClient>()
  
  constructor(public options: WebSocketOptions) {
    super()
    
    this.server = net.createServer((socket) => new WebSocketClient(this, socket))
    this.server.listen({ port: options.port, host: options.hostname }, () => this.emit('listening'))

    this.listeners()
  }
  
  stop() {
    this.emit('close')
  
    WebSocketServer.clients.clear()
    this.server.close()
  }

  conections () {
    return Array.from(WebSocketServer.clients.values())
  }
  
  private listeners () {
    this.server.on('error', (err) => this.emit('error', err))
    this.server.on('drop', (arg) => this.emit('drop', arg))
  }
}