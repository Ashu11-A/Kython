import { IncomingMessage, ServerResponse } from 'http'
import { Readable } from 'stream'

export class CustomResponse implements Response {
  headers = new Headers()
  ok: boolean = true
  redirected: boolean = false
  status: number = 200
  statusText: string = 'OK'
  type: ResponseType = 'default'
  url: string
  body: ReadableStream<Uint8Array> | null = null
  bodyUsed: boolean = false

  private res: ServerResponse
  private chunks: Uint8Array[] = []

  constructor(res: ServerResponse, req?: IncomingMessage) {
    this.res = res
    this.url = req ? new URL(req.url || '/', `http://${req.headers.host}`).toString() : ''
  }

  setStatus(status: number, statusText?: string) {
    this.status = status
    this.statusText = statusText || ''
    this.ok = status >= 200 && status < 300
    this.res.statusCode = status
    this.res.statusMessage = this.statusText || this.res.statusMessage
  }

  setHeader(name: string, value: string) {
    this.headers.set(name, value)
    this.res.setHeader(name, value)
  }

  clone(): Response {
    throw new Error('Clone method is not implemented.')
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    const buffer = Buffer.concat(this.chunks)
    const arrayBuffer = new ArrayBuffer(buffer.length)
    const view = new Uint8Array(arrayBuffer)
    view.set(buffer)
    return arrayBuffer
  }
  
  async blob(): Promise<Blob> {
    const arrayBuffer = await this.arrayBuffer()
    return new Blob([arrayBuffer])
  }

  async bytes(): Promise<Uint8Array> {
    const arrayBuffer = await this.arrayBuffer()
    return new Uint8Array(arrayBuffer)
  }

  async formData(): Promise<FormData> {
    const text = await this.text()
    const params = new URLSearchParams(text)
    const formData = new FormData()
    for (const [key, value] of params) {
      formData.append(key, value)
    }
    return formData
  }

  async json<T = unknown>(): Promise<T> {
    const text = await this.text()
    return JSON.parse(text)
  }

  async text(): Promise<string> {
    const buffer = Buffer.concat(this.chunks)
    return buffer.toString('utf-8')
  }

  send(data: string | Buffer | Uint8Array, statusCode: number = 200) {
    this.bodyUsed = true
    this.setStatus(statusCode)
    this.res.end(data)
  }

  sendJSON<T>(data: T, statusCode: number = 200) {
    const jsonString = JSON.stringify(data)
    this.setHeader('Content-Type', 'application/json')
    this.send(jsonString, statusCode)
  }

  sendStream(readable: Readable, statusCode: number = 200) {
    this.bodyUsed = true
    this.setStatus(statusCode)
    readable.pipe(this.res)
  }
}
