import createDebug from 'debug'
const debug = createDebug('app:World')

import Stage from '../engine/Stage'

import Game from '../engine/Game'
import Person from './Person'
import SimulationParameters from './SimulationParameters'
import generatePopulation from './generatePersons'

export default class Simulation extends Stage<Simulation> {
  constructor(game: Game, readonly parameters: SimulationParameters) {
    super('Simulation', game)
    ;(window as any).simulation = this
  }

  private _persons: Person[] = []

  get persons(): Person[] {
    return this._persons
  }

  setup() {
    this.game.keyboard.onKey('KeyR').onEvent('keyDownSingle', () => {
      this.restart()
    })

    this._persons = []
    for (const person of generatePopulation(this.parameters)) {
      this._persons.push(person)
      this.addActor(person)
    }
  }

  restart() {}
}
