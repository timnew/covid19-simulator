import { Rectangle } from 'pixi.js'
import { RandomVariable } from '../engine/randomGenerator'

export type OptionalNumber = number | undefined

export default interface SimulationParameters {
  readonly screenHeight: number
  readonly screenWidth: number

  readonly personRadius: RandomVariable
  readonly population: RandomVariable

  readonly initialVelocity: RandomVariable

  readonly wallBounce: boolean

  readonly initialInfected: RandomVariable
  readonly allowMoveCount: RandomVariable

  readonly courseDuration: RandomVariable
  readonly courseDurationPatient0: RandomVariable

  readonly fatalityRate: OptionalNumber

  readonly neutralImmunity: RandomVariable
  readonly curedImmunity: RandomVariable
  readonly infectedImmunity: RandomVariable

  readonly contagiousInfectionPower: RandomVariable
  readonly contagiousBoostPower: RandomVariable

  readonly virusDevelopmentFactor: RandomVariable
}

class BaseSettings implements SimulationParameters {
  readonly screenHeight: number
  readonly screenWidth: number

  readonly personRadius: RandomVariable = 5
  readonly population: RandomVariable = 400

  readonly initialVelocity: RandomVariable = {
    mean: 80,
    dev: 20
  }

  readonly wallBounce: boolean = false

  readonly initialInfected: RandomVariable = 1
  readonly allowMoveCount: RandomVariable = this.population

  readonly courseDuration: RandomVariable = { mean: 10, dev: 2 }
  readonly courseDurationPatient0: RandomVariable = 14

  readonly fatalityRate: OptionalNumber = undefined

  readonly neutralImmunity: RandomVariable = { mean: 100, dev: 20 }
  readonly curedImmunity: RandomVariable = { mean: 500, dev: 100 }
  readonly infectedImmunity: RandomVariable = { mean: -100, dev: 20 }

  readonly contagiousInfectionPower: RandomVariable = 1000
  readonly contagiousBoostPower: RandomVariable = 0

  readonly virusDevelopmentFactor: RandomVariable = { mean: 0, dev: 10 }

  constructor(screen: Rectangle) {
    this.screenWidth = screen.width
    this.screenHeight = screen.height
  }
}

export class Immunity extends BaseSettings {}

export class SuddenDeath extends BaseSettings {
  readonly courseDuration: RandomVariable = 10
  readonly courseDurationPatient0: RandomVariable = 14

  readonly fatalityRate: OptionalNumber = 0.5

  readonly neutralImmunity: RandomVariable = 1
  readonly curedImmunity: RandomVariable = Infinity
  readonly infectedImmunity: RandomVariable = -1

  readonly contagiousInfectionPower: RandomVariable = 10
  readonly contagiousBoostPower: RandomVariable = 0
}
