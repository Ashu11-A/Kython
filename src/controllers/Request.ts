export class KythonRequest extends Request {
  link: URL | null

  constructor(request: Request) {
    super(request)
    this.link = URL.parse(request.url)
  }
}