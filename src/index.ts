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
import './drivers/tls'


export * from './controllers/Drivers'
export * from './controllers/Kython'
export * from './controllers/Request'
export * from './controllers/Response'
export * from './controllers/Router'
export * from './types/driver'
export * from './types/global.d'
export * from './types/kython'
export * from './types/router'
export * from './drivers/http'
export * from './drivers/net'
export * from './drivers/tls'