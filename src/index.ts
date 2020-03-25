import { Application } from 'pixi.js'


const app = new Application({ width: 1745, height: 1000 })

document.body.appendChild(app.view)

import Game from './engine/Game'

const game = new Game(app)

game.run()
