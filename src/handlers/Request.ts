import type { IncomingMessage } from 'http'
import { Readable } from 'stream'

export class CustomRequest implements Request {
  cache: RequestCache = 'default'
  credentials: RequestCredentials = 'same-origin'
  destination: RequestDestination = ''
  headers: Headers
  integrity: string = ''
  keepalive: boolean = false
  method: string
  mode: RequestMode = 'cors'
  redirect: RequestRedirect = 'follow'
  referrer: string = ''
  referrerPolicy: ReferrerPolicy = 'no-referrer'
  signal: AbortSignal
  url: string
  body: ReadableStream<Uint8Array> | null = null
  bodyUsed: boolean = false
  
  constructor(req: IncomingMessage) {
    this.method = req.method || 'GET'
    this.headers = new Headers(Object.assign(req.headers))
    this.url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`).toString()

    this.signal = new AbortController().signal
  
    // Use polyfill para transformar o stream do Node.js
    if (req.method === 'POST' || req.method === 'PUT') {
      this.body = this.convertNodeStreamToReadable(req)
    }
  }
  
  clone(): Request {
    throw new Error('Clone method is not implemented.')
  }
  
  async arrayBuffer(): Promise<ArrayBuffer> {
    const chunks: Uint8Array[] = []

    for await (const chunk of this.getNodeStream()) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
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

    try {
      return JSON.parse(text)
    } catch {
      return {} as T
    }
  }
  
  async text(): Promise<string> {
    const chunks = []

    for await (const chunk of this.getNodeStream()) {
      chunks.push(chunk)
    }

    return Buffer.concat(chunks).toString('utf-8')
  }
  
  private getNodeStream(): Readable {
    if (!this.body) {
      throw new Error('Request body is not readable.')
    }

    return Readable.from(this.body as unknown as NodeJS.ReadableStream)
  }
  
  private convertNodeStreamToReadable(req: IncomingMessage): ReadableStream<Uint8Array> {
    const readable = new ReadableStream<Uint8Array>({
      start(controller) {
        req.on('data', (chunk) => {
          controller.enqueue(new Uint8Array(chunk))
        })
  
        req.on('end', () => {
          controller.close()
        })
  
        req.on('error', (err) => {
          controller.error(err)
        })
      },
    })
  
    return readable
  }
}
  