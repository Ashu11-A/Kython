export class KythonResponse {
  public response: Response = new Response()
  private statusCode: number = 200
  private statusTextData: string | undefined = undefined

  status (code: number) {
    this.statusCode = code

    return this
  }

  statusText (text: string) {
    this.statusTextData = text

    return this
  }

  json (data: object) {
    const json = JSON.stringify(data)

    this.response = new Response(json, {
      status: this.statusCode,
      statusText: this.statusTextData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  send(data: string) {
    this.response = new Response(data, {
      status: this.statusCode,
      statusText: this.statusTextData,
      headers: {
        'Content-Type': 'text/plain'
      },
    })
  }
}

