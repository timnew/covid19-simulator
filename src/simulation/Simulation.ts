import createDebug from 'debug'
const debug = createDebug('app:World')

import Stage from '../engine/Stage'

import Game from '../engine/Game'
import Person from './Person'
import SimulationParameters from './SimulationParameters'
import generatePopulation from './generatePersons'
import InteractionController from './InteractionController'
import Population from './Population'

export default class Simulation extends Stage<Simulation> {
  readonly interactionController: InteractionController = new InteractionController()
  readonly population: Population = new Population()

  constructor(game: Game, readonly parameters: SimulationParameters) {
    super('Simulation', game)
    ;(window as any).simulation = this
  }

  setup() {
    this.game.keyboard.onKey('KeyR').onEvent('keyDownSingle', () => {
      this.restart()
    })

    this.addController(this.interactionController)

    this.setupPopulation()
  }

  private setupPopulation() {
    this.population.clear()

    for (const person of generatePopulation(this.parameters)) {
      this.population.add(person)
      this.addActor(person)
    }
  }

  restart() {}
}
