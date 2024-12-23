import { EventEmitter } from 'events'
import { type DriverOptions, type Protocol } from '../types/driver'
import type { Runtime } from '../types/global'

export class Driver<Prototype extends Protocol, RunTyped extends Runtime> extends EventEmitter {
  static drivers = new Map<Protocol, Driver<Protocol, Runtime>>()

  public readonly name: string
  public readonly protocol: Prototype
  public readonly server!: ReturnType<DriverOptions<Prototype, RunTyped>['listen']>
  public listen: DriverOptions<Prototype, RunTyped>['listen']

  constructor(params: DriverOptions<Prototype, RunTyped>) {
    super()
    
    this.name = params.name
    this.protocol = params.protocol
    this.listen = params.listen
    
    Driver.drivers.set(this.protocol, this)
    
    this.logger()
    this.emit('ready', this)
  }
  
  logger() {
    this.on('ready', () => {
      console.log(`[Driver] ${this.name} instanced`)
    })
  }

  static getDriver<Prototype extends Protocol>(driver: Prototype) {
    return Driver.drivers.get(driver) as Driver<Prototype, Runtime>
  }
}