import { type DriverEvents, type DriverOptions, type Protocol } from '../types/driver'
import type { Runtime } from '../types/global'
import { TypedEventEmitter } from './EventEmitter'

export class Driver<
  RunTyped extends Runtime,
  Prototype extends Protocol,
  > extends TypedEventEmitter<DriverEvents<Prototype>> {
  static drivers = new Map<Protocol, Driver<Runtime, Protocol>>()

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
    return Driver.drivers.get(driver) as Driver<Runtime, Prototype>
  }
}