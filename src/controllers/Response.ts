import { IncomingMessage, ServerResponse } from 'http'
import { CustomResponse } from '../handlers/Response'
import { Runtime } from '../types/global.d'

export class KythonResponse {
  public response: Response | CustomResponse = new Response()
  private statusCode: number = 200
  private statusTextData: string | undefined = undefined

  constructor(private res?: ServerResponse, private req?: IncomingMessage) {}

  status (code: number) {
    this.statusCode = code

    return this
  }

  statusText (text: string) {
    this.statusTextData = text

    return this
  }

  json<T extends object>(data: T) {
    const json = JSON.stringify(data)

    if (Runtime.Node && this.res) {
      const response =  new CustomResponse(this.res, this.req)
      response.sendJSON(data)

      this.response = response
      
      return
    }

    this.response = new Response(json, {
      status: this.statusCode,
      statusText: this.statusTextData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  send<T extends string>(data: T) {
    if (Runtime.Node && this.res) {
      const response = new CustomResponse(this.res, this.req)
      response.send(data)

      this.response = response
      return
    }

    this.response = new Response(data, {
      status: this.statusCode,
      statusText: this.statusTextData,
      headers: {
        'Content-Type': 'text/plain'
      },
    })
  }
}

