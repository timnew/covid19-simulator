import { Application } from 'pixi.js'
const app = new Application({ width: 800, height: 600 })

document.body.appendChild(app.view)

// const { loader } = app
// loader
//   .add({ name: 'bird', url: birdImage })
//   .add({ name: 'topPipe', url: topPipeImage })
//   .add({ name: 'bottomPipe', url: bottomPipeImage })

import Game from './engine/Game'

const game = new Game(app)

game.run()
