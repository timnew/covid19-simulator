import Simulation from './Simulation'
import GameObject from '../engine/GameObject'
import Name, { singletonName } from '../engine/Name'
import Person from './Person'
import { Rectangle } from 'pixi.js'
import Vector2D from './Vector2D'
import SimulationParameters from './SimulationParameters'
import createDebug from 'debug'

const debug = createDebug('app:InteractionController')

export default class InteractionController implements GameObject<Simulation> {
  readonly name: Name = singletonName('InteractionController')

  update(deltaTime: number, stage: Simulation): void {
    const population = stage.population
    const parameters = stage.parameters

    for (let i1 = 0; i1 < population.size; i1++) {
      const p1 = population.get(i1)

      for (let i2 = i1 + 1; i2 < population.size; i2++) {
        const p2 = population.get(i2)

        if (this.testCollision(p1, p2)) {
          debug(`${p1.name} collides with ${p2.name}`)
          this.collide(p1, p2)
        }
      }

      this.testWall(p1, parameters)
    }
  }

  private collide(p1: Person, p2: Person) {
    if (p1.isMovable && p2.isMovable) {
      this.performElasticCollision(p1, p2)
    } else if (p1.isMovable) {
      this.performElasticBounce(p1)
    } else if (p2.isMovable) {
      this.performElasticBounce(p2)
    } else {
      // Bad case!
    }

    p1.touchedBy(p2)
    p2.touchedBy(p1)
  }

  private performElasticCollision(p1: Person, p2: Person) {
    const vDiff = p1.velocity.minus(p2.velocity)

    const pDiff = p2.personPosition.minus(p1.personPosition)

    if (vDiff.x * pDiff.x + vDiff.y * pDiff.y >= 0) {
      // Collision Angle
      const angle = -Math.atan2(pDiff.y, pDiff.x)

      // Project velocity to collision angle
      // where x is aligned collision, which is changed
      //       y is perpendicular to collision, which remains
      const pv1 = p1.velocity.project(angle)
      const pv2 = p2.velocity.project(angle)

      // Collision swaps x
      const cpv1 = new Vector2D(pv2.x, pv1.y)
      const cpv2 = new Vector2D(pv1.x, pv2.y)

      // Project velocity back to axises
      p1.velocity = cpv1.project(-angle)
      p2.velocity = cpv2.project(-angle)
    }
  }

  private performElasticBounce(p: Person) {
    p.velocity = p.velocity.mul(-1)
  }

  private testCollision(p1: Person, p2: Person): Boolean {
    return (
      this.testAabb(p1.collisionBounds, p2.collisionBounds) &&
      this.testDistance(
        p1.personPosition,
        p1.radius,
        p2.personPosition,
        p2.radius
      )
    )
  }

  private testAabb(r1: Rectangle, r2: Rectangle): Boolean {
    return (
      r1.left < r2.right &&
      r1.right > r2.left &&
      r1.top < r2.bottom &&
      r1.bottom > r2.top
    )
  }

  private testDistance(
    p1: Vector2D,
    r1: number,
    p2: Vector2D,
    r2: number
  ): Boolean {
    const xDiff = p1.x - p2.x
    const yDiff = p2.y - p2.y
    const distanceSquare = xDiff * xDiff + yDiff * yDiff

    const sumOfRadius = r1 + r2
    const radiusSquare = sumOfRadius * sumOfRadius

    return distanceSquare < radiusSquare
  }

  private testWall(person: Person, parameters: SimulationParameters) {
    if (parameters.wallBounce) {
      this.testWallBounce(person, parameters)
    } else {
      this.testWallTransition(person, parameters)
    }
  }

  private testWallTransition(person: Person, parameters: SimulationParameters) {
    const { screenWidth, screenHeight } = parameters
    let { x, y } = person.personPosition

    if (x < 0) {
      x += screenWidth
    }
    if (x > screenWidth) {
      x -= screenWidth
    }
    if (y < 0) {
      y += screenHeight
    }
    if (y > screenHeight) {
      y -= screenHeight
    }

    if (x !== person.x || y !== person.y) {
      debug(`${person.name} penetrated wall`)
      person.personPosition = new Vector2D(x, y)
    }
  }

  private testWallBounce(person: Person, parameters: SimulationParameters) {
    const { screenWidth, screenHeight } = parameters
    const { radius } = person
    const { x, y } = person.personPosition
    let vx = 1
    let vy = 1

    if (x <= radius || x >= screenWidth - radius) {
      vx = -1
    }

    if (y <= radius || y >= screenHeight - radius) {
      vy = -1
    }

    if (vx < 0 || vy < 0) {
      debug(`${person.name} bounced on wall`)
      person.velocity = person.velocity.mul2(vx, vy)
    }
  }
}
