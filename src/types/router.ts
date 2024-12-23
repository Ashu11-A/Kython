import type { KythonRequest } from '../controllers/Request'
import type { KythonResponse } from '../controllers/Response'

export type MethodKeys = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type MethodParams = {
  [k in MethodKeys]?: (request: KythonRequest, response: Omit<KythonResponse, 'response'>) => Promise<void> | void
}

export type RouterParams = {
  name?: string,
  description?: string,
  path: string
  methods: MethodParams
}