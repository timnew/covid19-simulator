import Person from './Person'
import SimulationParameters from './SimulationParameters'
import { randomBoolean, randomFloat } from '../engine/randomGenerator'
import createDebug from 'debug'

type StateConstructor = new (parameters: SimulationParameters) => PersonState

export type Color = number

export abstract class PersonState {
  constructor(
    readonly parameters: SimulationParameters,
    readonly name: string,
    readonly color: Color
  ) {}

  get isContagious(): boolean {
    return this.immunity < 0
  }

  get hasSymptom(): boolean {
    return this.isContagious
  }

  get isMovable(): boolean {
    return true
  }

  get isHitEnabled(): boolean {
    return true
  }

  private _immunity!: number
  get immunity(): number {
    return this._immunity
  }
  set immunity(value: number) {
    this.onImmunityChanged(this._immunity, value)
    this._immunity = value
  }

  protected abstract onImmunityChanged(before: number, after: number): void

  protected person!: Person

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

  updatePerson(deltaTime: number): void {}

  touchedBy(other: Person): void {}
}

abstract class Healthy extends PersonState {
  onImmunityChanged(_before: number, after: number) {
    if (after < 0) {
      this.transitTo(Infected)
    }
  }

  touchedBy(other: Person): void {
    if (other.state.isContagious) {
      this.immunity -= randomFloat(this.parameters.contagiousInfectionPower)
    }
  }
}

export class Neutral extends Healthy {
  constructor(parameters: SimulationParameters) {
    super(parameters, 'Neutral', 0x909090)

    this.immunity = randomFloat(parameters.neutralImmunity)
  }
}

export class Infected extends PersonState {
  readonly debug = createDebug('app:State:Infected')

  constructor(
    parameters: SimulationParameters,
    private courseDuration: number = randomFloat(parameters.courseDuration)
  ) {
    super(parameters, 'Infected', 0xff3030)
    this.immunity = randomFloat(parameters.infectedImmunity)
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

  touchedBy(other: Person): void {
    if (other.state.isContagious) {
      this.immunity +
        this.immunity * randomFloat(this.parameters.contagiousBoostPower)
    }
  }

  updatePerson(deltaTime: number): void {
    this.immunity += randomFloat(this.parameters.virusDevelopmentFactor)
    this.remainingDuration -= deltaTime
    this.debug(
      'Infected: imm: %d, dur: %d',
      this.immunity,
      this.remainingDuration
    )
  }

  courseEnds() {
    if (this.parameters.fatalityRate != null) {
      this.transitTo(
        randomBoolean(this.parameters.fatalityRate) ? Deceased : Cured
      )
    } else {
      this.transitTo(Deceased)
    }
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
    this.immunity = randomFloat(parameters.curedImmunity)
  }
}

export class Deceased extends PersonState {
  constructor(parameters: SimulationParameters) {
    super(parameters, 'Deceased', 0x303030)
  }

  protected onImmunityChanged(_before: number, _after: number): void {}

  get isMovable(): boolean {
    return false
  }

  get isHitEnabled(): boolean {
    return false
  }
}
