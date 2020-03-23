import Simulation from './Simulation'
import GameObject from '../engine/GameObject'
import Name, { singletonName } from '../engine/Name'

class InteractionController implements GameObject<Simulation> {
  readonly name: Name = singletonName('InteractionController')

  update(deltaTime: number, stage: Simulation): void {
    stage.persons
  }
}
