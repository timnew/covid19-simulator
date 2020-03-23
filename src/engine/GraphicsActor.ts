import { Graphics } from 'pixi.js'
import GameObject from './GameObject'
import Name from './Name'

export abstract class GraphicsActor<TStage> extends Graphics
  implements GameObject<TStage> {
  constructor(readonly name: Name) {
    super()
  }

  abstract update(deltaTime: number, stage: TStage): void
}
