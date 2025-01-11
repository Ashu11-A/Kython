import { Runtime, SystemOS } from './types/global.d'

global.runtime = typeof Deno !== 'undefined'
  ? Runtime.Deno
  : typeof Bun !== 'undefined'
    ? Runtime.Bun
    : Runtime.Node

global.system = process.platform === 'linux'
  ? SystemOS.Linux
  : process.platform === 'darwin'
    ? SystemOS.Mac
    : SystemOS.Windows

import './drivers/http'
import './drivers/net'


export * from './controllers/Drivers'
export * from './controllers/EventEmitter'
export * from './controllers/Kython'
export * from './controllers/Response'
export * from './controllers/Router'

export * from './handlers/Request'
export * from './handlers/Response'
export * from './handlers/WebSocketClient'
export * from './handlers/WebSocketServer'

export * from './types/driver'
export * from './types/global.d'
export * from './types/kython'
export * from './types/router'
export * from './types/websocket'