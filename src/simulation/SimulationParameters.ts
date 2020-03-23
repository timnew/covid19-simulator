import { Rectangle } from 'pixi.js'

export default class SimulationParameters {
  readonly screenHeight: number
  readonly screenWidth: number
  readonly halfScreenHeight: number
  readonly halfScreenWidth: number

  readonly personRadius: number
  readonly population: number = 100

  readonly maxInitialSpeed: number = 50

  constructor(readonly screen: Rectangle) {
    this.screenWidth = screen.width
    this.screenHeight = screen.height
    this.halfScreenHeight = this.screenHeight / 2
    this.halfScreenWidth = this.screenWidth / 2
    this.personRadius = 5
  }
}
