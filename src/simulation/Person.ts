import { GraphicsActor } from '../engine/GraphicsActor'
import { typedName } from '../engine/Name'
import Simulation from './Simulation'
import { Rectangle } from 'pixi.js'
import Vector2D from './Vector2D'
import createDebug from 'debug'
import { PersonState } from './PersonState'

export default class Person extends GraphicsActor<Simulation> {
  readonly debug: debug.IDebugger

  constructor(
    name: string,
    readonly radius: number,
    position: Vector2D,
    velocity: Vector2D,
    public isMovable: boolean,
    state: PersonState
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

  private _state: PersonState
  get state(): PersonState {
    return this._state
  }
  set state(newState: PersonState) {
    this._state = newState
    newState.attachedTo(this)
  }

  get collisionBounds(): Rectangle {
    return this.getBounds()
  }

  update(deltaTime: number, stage: Simulation): void {
    this.updatePosition(deltaTime)
    this.state.updatePerson(deltaTime)
  }

  touchedBy(other: Person) {
    this.debug(`Touched by ${other.name.localName}`)
    this.state.touchedBy(other)
  }

  private updatePosition(deltaTime: number) {
    if (this.isMovable) {
      this.personPosition = this.velocity
        .mul(deltaTime)
        .plus(this.personPosition)
    }
  }
}
