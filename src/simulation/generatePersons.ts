import SimulationParameters from './SimulationParameters'
import Person from './Person'
import {
  randomFloat,
  PickAllowance,
  randomPick,
  randomName
} from '../engine/randomGenerator'
import Vector2D from './Vector2D'
import { Infected, Neutral, PersonState } from './PersonState'

export default function* generatePopulation(
  parameters: SimulationParameters
): Generator<Person, void, unknown> {
  const allowance = new PopulationAllowance(parameters)

  while (allowance.hasMore) {
    yield allowance.createPerson()
  }
}

export class PopulationAllowance {
  readonly rows: number
  readonly cols: number

  readonly blockWidth: number
  readonly blockHeight: number
  readonly halfBlockWidth: number
  readonly halfBlockHeight: number

  index: number

  readonly moveableAllowance: PickAllowance

  readonly stateAllowance: PickAllowance

  constructor(readonly parameters: SimulationParameters) {
    const population = parameters.population

    // === Offset algorithm ===

    const { screenHeight, screenWidth } = parameters

    const screenRatio = 1 // screenWidth / screenHeight
    // (commonFactor * screenRatio) * commonFactor = population
    const commonFactor = Math.sqrt(population / screenRatio)
    this.rows = Math.ceil(commonFactor)
    this.cols = Math.ceil(commonFactor * screenRatio)

    this.blockWidth = screenWidth / this.rows
    this.blockHeight = screenHeight / this.cols
    this.halfBlockWidth = this.blockWidth / 2
    this.halfBlockHeight = this.blockHeight / 2

    this.index = 0

    // ==========================

    this.moveableAllowance = {
      movable: parameters.allowMoveCount,
      fixed: population - parameters.allowMoveCount
    }

    this.stateAllowance = {
      infected: parameters.initialInfected,
      neutral: population - parameters.initialInfected
    }
  }

  get headCount(): number {
    return this.parameters.population - this.index
  }

  get hasMore(): boolean {
    return this.headCount > 0
  }

  get x(): number {
    return this.index % this.cols
  }

  get y(): number {
    return Math.floor(this.index / this.cols)
  }

  createPerson(): Person {
    const result = new Person(
      this.nextName(),
      this.parameters.personRadius,
      this.nextPosition(),
      this.nextVelocity(),
      this.nextMovable(),
      this.nextState()
    )

    this.index += 1

    return result
  }

  private nextName(): string {
    return randomName()
  }

  private nextPosition(): Vector2D {
    return new Vector2D(
      this.halfBlockWidth +
        this.x * this.blockWidth +
        this.halfBlockWidth *
          randomFloat({
            min: -0.8,
            max: 0.8
          }),
      this.halfBlockHeight +
        this.y * this.blockHeight +
        this.halfBlockHeight *
          randomFloat({
            min: -0.8,
            max: 0.8
          })
    )
  }

  private nextVelocity(): Vector2D {
    return Vector2D.fromPolarCoordinate(
      randomFloat({
        min: this.parameters.minInitialSpeed,
        max: this.parameters.maxInitialSpeed
      }),
      randomFloat({ min: 0, max: Math.PI * 2 })
    )
  }

  private nextMovable(): boolean {
    const picked = randomPick(this.moveableAllowance)
    return picked == 'movable'
  }

  private nextState(): PersonState {
    const picked = randomPick(this.stateAllowance)

    switch (picked) {
      case 'infected':
        return new Infected(this.parameters, this.parameters.maxCourseDuration)
      default:
        return new Neutral(this.parameters)
    }
  }
}
