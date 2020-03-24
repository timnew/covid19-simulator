import Person, { IPersonState } from './Person'
import Simulation from './Simulation'

type Color = number

const gray: Color = 0x909090
const red: Color = 0xff3030
const cyan: Color = 0x30eeee
const darkGray: Color = 0x303030

export abstract class PersonState implements IPersonState {
  get isContagious(): Boolean {
    return false
  }
  get isImmunised(): Boolean {
    return false
  }

  constructor(readonly color: Color) {}

  updatePerson(person: Person, deltaTime: number, stage: Simulation): void {}

  abstract touchedBy(person: Person, another: Person): void

  attachedTo(person: Person): void {
    this.redraw(person)
  }

  redraw(person: Person) {
    person.clear()

    person.beginFill(this.color)
    person.drawCircle(0, 0, person.radius)
    person.endFill()
  }
}

export class Neutral extends PersonState {
  constructor() {
    super(0x909090)
  }
  touchedBy(person: Person, another: Person): void {
    throw new Error('Method not implemented.')
  }
}

export class Infected extends PersonState {
  constructor() {
    super(0xff9090)
  }
  touchedBy(person: Person, another: Person): void {
    throw new Error('Method not implemented.')
  }
}

export class Cured extends PersonState {
  constructor() {
    super(0x90ffff)
  }
  touchedBy(person: Person, another: Person): void {
    throw new Error('Method not implemented.')
  }
}

export class Deceased extends PersonState {
  constructor() {
    super(0x303030)
  }
  touchedBy(person: Person, another: Person): void {
    throw new Error('Method not implemented.')
  }
}
