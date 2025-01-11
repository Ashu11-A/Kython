import * as crypto from 'crypto'
import { Socket } from 'net'
import { WebSocketServer } from './WebSocketServer'

export class WebSocketClient {
  public id!: string
  private isListening: boolean = false
  
  constructor(public readonly server: WebSocketServer, public readonly socket: Socket) {
    this.handleEvents()
  }
  
  send (content: string) {
    const response = WebSocketClient.encodeWebSocketFrame(content)
    
    this.socket.write(response)
  }
  
  stop () {
    this.socket.destroy()
  }
  
  private handleEvents() {
    this.socket.on('data', (data) => this.handleData(data))
    this.socket.on('close', () => this.handleClose())
    this.socket.on('error', (err) => this.handleError(err))
    setTimeout(async () => !this.isListening ? this.socket.destroy() : null, 10_000)
  }
  
  private handleData(data: Buffer) {
    switch (true) {
    /**
        * Connection disconnection requests with
        * [ 136, ... ]
        */
    case (data[0] === 136): {
      console.log(`Connection disconnection request: ${this.id}`)
      this.stop()
      break
    }
    case (!this.isListening): {
      this.handshake(data)
      break
    }
    default: {
      this.processMessage(data)
    }
    }
  }
  
  private handshake(data: Buffer) {
    const message = data.toString()
    const secWebSocketKey = WebSocketClient.extractSecWebSocketKey(message)
  
    if (secWebSocketKey) {
      this.id = secWebSocketKey
      const acceptKey = WebSocketClient.generateWebSocketAcceptKey(message)
      this.socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Accept: ${acceptKey}\r\n` +
            '\r\n'
      )
      this.isListening = true
  
      WebSocketServer.clients.set(this.id, this)
      this.server.emit('client.connection', this)
    }
  }
  
  private processMessage(data: Buffer) {
    try {
      const decodedMessage = WebSocketClient.decodeWebSocketFrame(data)
      this.server.emit('client.message', decodedMessage, this)
    } catch (error) {
      console.error(`Failed to process message from ${this.id}:`, error)
    }
  }
  
  private handleClose() {
    console.log(`Client ${this.id} disconnected.`)
    WebSocketServer.clients.delete(this.id)
  }
  
  private handleError(err: Error) {
    console.error(`Error on client ${this.id}:`, err)
    this.socket.destroy()
    WebSocketServer.clients.delete(this.id)
  }
  
  static extractSecWebSocketKey(message: string): string | null {
    const match = message.match(/Sec-WebSocket-Key: (.+)/)
    return match ? match[1].trim() : null
  }
  
  static decodeWebSocketFrame(buffer: Buffer): string {
    const isMasked = (buffer[1] & 0x80) === 0x80
    const payloadLength = buffer[1] & 0x7f
    let maskingKey: Buffer | null = null
    let payloadStart = 2
  
    if (payloadLength === 126) {
      payloadStart += 2
    } else if (payloadLength === 127) {
      payloadStart += 8
    }
  
    if (isMasked) {
      maskingKey = buffer.slice(payloadStart, payloadStart + 4)
      payloadStart += 4
    }
  
    const payload = buffer.slice(payloadStart)
    if (maskingKey) {
      for (let i = 0; i < payload.length; i++) {
        payload[i] ^= maskingKey[i % 4]
      }
    }
  
    return payload.toString('utf8')
  }
  
  static encodeWebSocketFrame(
    message: string,
  ): Uint8Array {
    const messageBuffer = Buffer.from(message, 'utf-8')
    const messageLength = messageBuffer.length
  
    // Primeiro byte: FIN flag (0x80) | Opcode para texto (0x01)
    const firstByte = 0x80 | 0x01 // FIN e texto
  
    // Determina o tamanho do payload
    let payloadLength = 0
    let extendedPayload: Uint8Array | null = null
  
    if (messageLength <= 125) {
      payloadLength = messageLength
    } else if (messageLength <= 0xffff) {
      payloadLength = 126
      extendedPayload = new Uint8Array(2)
      const dataView = new DataView(extendedPayload.buffer)
      dataView.setUint16(0, messageLength, false) // Big-endian
    } else {
      payloadLength = 127
      extendedPayload = new Uint8Array(8)
      const dataView = new DataView(extendedPayload.buffer)
      dataView.setBigUint64(0, BigInt(messageLength), false) // Big-endian
    }
  
    // Monta o frame
    const frameLength = 2 + (extendedPayload ? extendedPayload.length : 0) + messageLength
    const frame = new Uint8Array(frameLength)
  
    // Configura os bytes iniciais
    frame[0] = firstByte
    frame[1] = payloadLength
  
    if (extendedPayload) frame.set(extendedPayload, 2)
  
    frame.set(messageBuffer, frameLength - messageLength)
  
    return frame
  }  
  
  static generateWebSocketAcceptKey(request: string): string {
    const match = request.match(/Sec-WebSocket-Key: (.+)/)
    if (!match) throw new Error('Invalid WebSocket handshake request')
  
    const key = match[1].trim()
    return crypto
      .createHash('sha1')
      .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
      .digest('base64')
  }
}