import { GraphicsActor } from '../engine/GraphicsActor'
import { typedName } from '../engine/Name'
import Simulation from './Simulation'
import { Point, PointLike } from 'pixi.js'

type Color = number

const gray: Color = 0x909090
const red: Color = 0xff3030
const cyan: Color = 0x30eeee
const darkGray: Color = 0x303030

export abstract class PersonState {
  get isContagious(): Boolean {
    return false
  }
  get hasSymptom(): Boolean {
    return false
  }
  get isImmunised(): Boolean {
    return false
  }
  get isMovable(): Boolean {
    return true
  }
  get isMoving(): Boolean {
    return true
  }

  constructor(readonly color: Color) {}
}

class Neutral extends PersonState {
  constructor() {
    super(gray)
  }
}

class Infected extends PersonState {
  constructor() {
    super(red)
  }

  get isContagious() {
    return true
  }

  get hasSymptom() {
    return true
  }
}

class Deceased extends PersonState {
  constructor() {
    super(darkGray)
  }

  get isMoving() {
    return false
  }
}

class Cured extends PersonState {
  constructor() {
    super(cyan)
  }
  get isImmunised() {
    return true
  }
}

export default class Person extends GraphicsActor<Simulation> {
  constructor(
    name: string,
    readonly radius: number,
    position: PointLike,
    velocity: PointLike
  ) {
    super(typedName('Person', name))

    this.position.copy(position)
    this._velocity = new Point(velocity.x, velocity.y)
    this.redraw()
  }

  private _velocity: Point
  get velocity(): PointLike {
    return this._velocity
  }
  set velocity(value: PointLike) {
    this._velocity.copy(value)
  }

  update(deltaTime: number, stage: Simulation): void {
    this.updatePosition(deltaTime)
    // this.redraw()
  }

  private updatePosition(deltaTime: number) {
    this.position.set(
      this.position.x + this.velocity.x * deltaTime,
      this.position.y + this.velocity.y * deltaTime
    )
  }

  private redraw() {
    this.clear()

    this.beginFill(0xc0c0c0)
    this.drawCircle(0, 0, this.radius)
    this.endFill()
  }
}
