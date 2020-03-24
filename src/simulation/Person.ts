import { GraphicsActor } from '../engine/GraphicsActor'
import { typedName } from '../engine/Name'
import Simulation from './Simulation'
import { Rectangle } from 'pixi.js'
import Vector2D from './Vector2D'
import createDebug from 'debug'

export interface IPersonState {
  updatePerson(person: Person, deltaTime: number, stage: Simulation): void
  touchedBy(person: Person, another: Person): void
  attachedTo(person: Person): void
}

export default class Person extends GraphicsActor<Simulation> {
  readonly debug: debug.IDebugger

  constructor(
    name: string,
    readonly radius: number,
    position: Vector2D,
    velocity: Vector2D,
    public isMovable: boolean,
    state: IPersonState
  ) {
    super(typedName('Person', name))
    this.debug = createDebug(`app:Person:${name}`)

    this.personPosition = position
    this.velocity = Vector2D.fromPoint(velocity)

    this._state = state
    state.attachedTo(this)
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

  private _state: IPersonState
  get state(): IPersonState {
    return this._state
  }
  set state(newState: IPersonState) {
    this._state = newState
    newState.attachedTo(this)
  }

  get collisionBounds(): Rectangle {
    return this.getBounds()
  }

  update(deltaTime: number, stage: Simulation): void {
    this.updatePosition(deltaTime)
  }

  touchedBy(another: Person) {
    this.debug(`Touched by ${another.name.localName}`)
  }

  private updatePosition(deltaTime: number) {
    if (this.isMovable) {
      this.personPosition = this.velocity
        .mul(deltaTime)
        .plus(this.personPosition)
    }
  }
}
