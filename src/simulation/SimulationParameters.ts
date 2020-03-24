import { Rectangle } from 'pixi.js'
export default class SimulationParameters {
  readonly screenHeight: number
  readonly screenWidth: number

  readonly personRadius: number
  readonly population: number
  readonly maxInitialSpeed: number
  readonly minInitialSpeed: number
  readonly wallBounce: boolean

  readonly fatalityRate: number
  readonly initialInfected: number
  readonly allowMoveCount: number

  constructor(readonly screen: Rectangle) {
    this.screenWidth = screen.width
    this.screenHeight = screen.height

    this.personRadius = 5
    this.population = 100

    this.maxInitialSpeed = 80
    this.minInitialSpeed = 30
    this.wallBounce = false

    this.fatalityRate = 0.05

    this.initialInfected = 1
    this.allowMoveCount = this.population
  }
}
