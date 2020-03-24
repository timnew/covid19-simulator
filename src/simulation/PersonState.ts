import Person from './Person'
import SimulationParameters from './SimulationParameters'
import { randomBoolean, randomFloat } from '../engine/randomGenerator'
import createDebug from 'debug'

export type Color = number

export abstract class PersonState {
  get isContagious(): boolean {
    return false
  }
  get hasSymptom(): boolean {
    return this.isContagious
  }

  get isMovable(): boolean {
    return true
  }

  private _person!: Person

  protected get person(): Person {
    return this._person
  }

  protected get parameters(): SimulationParameters {
    return this.person.parameters
  }

  constructor(readonly name: string, readonly color: Color) {}

  updatePerson(deltaTime: number): void {}

  touchedBy(another: Person): void {}

  attachedTo(person: Person): void {
    this._person = person

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

export class Neutral extends PersonState {
  constructor() {
    super('Neutral', 0x909090)
  }

  touchedBy(another: Person): void {
    if (another.state.isContagious) {
      this.person.state = new Infected(
        randomFloat(
          this.parameters.maxCourseDuration,
          this.parameters.minCourseDuration
        )
      )
    }
  }
}

export class Infected extends PersonState {
  readonly debug = createDebug('app:State:Infected')

  get isContagious() {
    return true
  }

  constructor(courseDuration: number) {
    super('Infected', 0xff3030)
    this.remainingDuration = courseDuration
  }

  private _duration!: number
  get remainingDuration(): number {
    return this._duration
  }
  set remainingDuration(value: number) {
    this._duration = value
    if (this._duration <= 0) {
      this.courseEnds()
    }
  }

  updatePerson(deltaTime: number): void {
    this.remainingDuration -= deltaTime
    this.debug('Remain: %d', this.remainingDuration)
  }

  courseEnds() {
    if (randomBoolean(this.parameters.fatalityRate)) {
      this.person.state = new Deceased()
    } else {
      this.person.state = new Cured()
    }
  }
}

export class Cured extends PersonState {
  constructor() {
    super('Cured', 0x30eeee)
  }
}

export class Deceased extends PersonState {
  constructor() {
    super('Deceased', 0x303030)
  }

  get isMovable(): boolean {
    return false
  }
}
