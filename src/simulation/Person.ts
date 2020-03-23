import { GraphicsActor } from '../engine/GraphicsActor'
import { typedName } from '../engine/Name'
import Simulation from './Simulation'
import { Point, PointLike, Rectangle } from 'pixi.js'
import Vector2D from './Vector2D'

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
    position: Vector2D,
    velocity: Vector2D
  ) {
    super(typedName('Person', name))

    this.personPosition = position
    this.velocity = Vector2D.fromPoint(velocity)
    this.redraw()
  }

  private _position: Vector2D = Vector2D.ZERO
  get personPosition(): Vector2D {
    return this._position
  }
  set personPosition(value: Vector2D) {
    this._position = value
    this.position.copy(value)
  }
  velocity: Vector2D

  get collisionBounds(): Rectangle {
    return this.getBounds()
  }

  update(deltaTime: number, stage: Simulation): void {
    this.updatePosition(deltaTime)
    // this.redraw()
  }

  touchedBy(another: Person) {}

  private updatePosition(deltaTime: number) {
    this.personPosition = this.personPosition.plus(this.velocity.mul(deltaTime))
  }

  private redraw() {
    this.clear()

    this.beginFill(0xc0c0c0)
    this.drawCircle(0, 0, this.radius)
    this.endFill()
  }
}
