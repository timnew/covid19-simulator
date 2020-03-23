import { PointLike } from 'pixi.js'

export default class Vector2D implements PointLike {
  constructor(readonly x: number, readonly y: number) {}

  set(x?: number | undefined, y?: number | undefined): void {
    throw new Error('Not Supported, Vector2D is immutable')
  }

  copy(point: PointLike): void {
    throw new Error('Not Supported, Vector2D is immutable')
  }

  plus(another: PointLike): Vector2D {
    return new Vector2D(this.x + another.x, this.y + another.y)
  }

  minus(another: PointLike): Vector2D {
    return new Vector2D(this.x - another.x, this.y - another.y)
  }

  mul(scale: number): Vector2D {
    return new Vector2D(this.x * scale, this.y * scale)
  }

  mul2(scaleX: number, scaleY: number): Vector2D {
    return new Vector2D(this.x * scaleX, this.y * scaleY)
  }

  length(): number {
    return Math.sqrt(this.y * this.y + this.x * this.x)
  }

  static fromPolarCoordinate(r: number, phi: number): Vector2D {
    return new Vector2D(r * Math.cos(phi), r * Math.sin(phi))
  }

  static fromPoint(point: PointLike): Vector2D {
    return new Vector2D(point.x, point.y)
  }

  static readonly ZERO = new Vector2D(0, 0)
}

export function fromDegree(angleDegree: number): number {
  return (angleDegree / 180) * Math.PI
}
