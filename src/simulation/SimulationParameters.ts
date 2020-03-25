import { Rectangle } from 'pixi.js'

export default class SimulationParameters {
  readonly screenHeight: number
  readonly screenWidth: number

  readonly personRadius: number = 5
  readonly population: number = 200

  readonly maxInitialSpeed: number = 80
  readonly minInitialSpeed: number = 30
  readonly wallBounce: boolean = false

  readonly initialInfected: number = 1
  readonly allowMoveCount: number = this.population

  readonly minCourseDuration: number = 5
  readonly maxCourseDuration: number = 10

  readonly neutralImmunity: number = 100
  readonly curedImmunity: number = Infinity
  readonly infectedImmunity: number = -100

  readonly contagiousInfectionPower: number = 100
  readonly contagiousBoostPower: number = 0

  readonly virusDevelopmentFactor: number = 0

  constructor(screen: Rectangle) {
    this.screenWidth = screen.width
    this.screenHeight = screen.height
  }
}
