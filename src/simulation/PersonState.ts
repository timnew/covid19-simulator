import Person from './Person'
import SimulationParameters from './SimulationParameters'
import { randomBoolean, randomFloat } from '../engine/randomGenerator'
import createDebug from 'debug'

type StateConstructor = new (parameters: SimulationParameters) => PersonState

export type Color = number

export abstract class PersonState {
  private _immunity!: number
  get immunity(): number {
    return this._immunity
  }
  set immunity(value: number) {
    this.onImmunityChanged(this._immunity, value)
    this._immunity = value
  }

  protected abstract onImmunityChanged(before: number, after: number): void

  get isContagious(): boolean {
    return this.immunity < 0
  }

  get hasSymptom(): boolean {
    return this.isContagious
  }

  get isMovable(): boolean {
    return true
  }

  protected person!: Person

  constructor(
    readonly parameters: SimulationParameters,
    readonly name: string,
    readonly color: Color
  ) {}

  updatePerson(deltaTime: number): void {}

  touchedBy(another: Person): void {}

  transitTo(GivenState: StateConstructor) {
    this.person.state = new GivenState(this.parameters)
  }

  attachedTo(person: Person): void {
    this.person = person

    this.person.isMovable = this.person.isMovable && this.isMovable

    this.redraw()
  }

  protected redraw() {
    const person = this.person

    person.clear()

    person.beginFill(this.color)
    person.drawCircle(0, 0, person.radius)
    person.endFill()
  }
}

abstract class Healthy extends PersonState {
  onImmunityChanged(_before: number, after: number) {
    if (after < 0) {
      this.transitTo(Infected)
    }
  }

  touchedBy(another: Person): void {
    if (another.state.isContagious) {
      this.immunity -= this.parameters.contagiousInfectionPower
    }
  }
}

export class Neutral extends Healthy {
  constructor(parameters: SimulationParameters) {
    super(parameters, 'Neutral', 0x909090)

    this.immunity = parameters.neutralImmunity
  }
}

export class Infected extends PersonState {
  readonly debug = createDebug('app:State:Infected')

  constructor(
    parameters: SimulationParameters,
    private courseDuration: number = randomFloat(parameters.courseDuration)
  ) {
    super(parameters, 'Infected', 0xff3030)
    this.immunity = parameters.infectedImmunity
  }

  get remainingDuration(): number {
    return this.courseDuration
  }
  set remainingDuration(value: number) {
    this.courseDuration = value
    if (this.courseDuration <= 0) {
      this.courseEnds()
    }
  }

  updatePerson(deltaTime: number): void {
    this.immunity += this.immunity * this.parameters.contagiousBoostPower
    this.remainingDuration -= deltaTime
    this.debug(
      'Infected: imm: %d, dur: %d',
      this.immunity,
      this.remainingDuration
    )
  }

  courseEnds() {
    this.person.state = new Deceased(this.parameters)
  }

  protected onImmunityChanged(before: number, after: number): void {
    if (this.immunity > 0) {
      this.transitTo(Cured)
    }
  }
}

export class Cured extends Healthy {
  constructor(parameters: SimulationParameters) {
    super(parameters, 'Cured', 0x30eeee)
    this.immunity = parameters.curedImmunity
  }
}

export class Deceased extends PersonState {
  constructor(parameters: SimulationParameters) {
    super(parameters, 'Deceased', 0x303030)
  }

  get isMovable(): boolean {
    return false
  }
}
