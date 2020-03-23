import { Application, Rectangle, loaders, ticker, Container } from 'pixi.js'
import KeyboardListener from './KeyboardListener'

import GameObject from './GameObject'
import Simulation from '../simulation/Simulation'
import SimulationParameters from '../simulation/SimulationParameters'

class Game {
  private paused: boolean = false

  constructor(private app: Application) {}

  get screen(): Rectangle {
    return this.app.screen
  }

  get resources(): loaders.ResourceDictionary {
    return this.app.loader.resources
  }

  run() {
    this.app.loader.load(() => {
      this.setup()
      this.app.ticker.add(this.loop.bind(this))
    })
  }

  readonly keyboard: KeyboardListener = new KeyboardListener()

  setup() {
    this.keyboard.subscribe()

    this.keyboard.onKey('KeyP').onEvent('keyDownSingle', () => {
      this.paused = !this.paused
    })

    const simulation = new Simulation(
      this,
      new SimulationParameters(this.screen)
    )

    simulation.setup()

    this.stage = simulation
  }

  get stage(): GameObject<Game> & Container {
    return this.app.stage as GameObject<Game> & Container
  }

  set stage(stage: GameObject<Game> & Container) {
    this.app.stage = stage
  }

  loop() {
    if (this.paused) return

    const ticker = this.app.ticker

    this.stage.update(ticker.elapsedMS / 1000, this)
  }
}

export default Game
