import { Rectangle } from 'pixi.js'
export default class SimulationParameters {
  readonly screenHeight: number
  readonly screenWidth: number

  readonly personRadius: number
  readonly population: number
  readonly maxInitialSpeed: number
  readonly minInitialSpeed: number
  readonly wallBounce: boolean

  readonly initialInfected: number
  readonly allowMoveCount: number

  readonly fatalityRate: number
  readonly minCourseDuration: number
  readonly maxCourseDuration: number

  constructor(readonly screen: Rectangle) {
    this.screenWidth = screen.width
    this.screenHeight = screen.height

    this.personRadius = 5
    this.population = 200

    this.maxInitialSpeed = 80
    this.minInitialSpeed = 30
    this.wallBounce = false

    this.initialInfected = 1
    this.allowMoveCount = this.population

    this.fatalityRate = 0.5
    this.minCourseDuration = 5
    this.maxCourseDuration = 10
  }
}
