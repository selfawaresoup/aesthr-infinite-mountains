import {
  createAudioEntity,
  enableAudioEntity,
  disableAudioEntity,
  createAudioEnvironment,
  moveListenerBy,
  noteFrequency,
  rotateListenerTo
} from './audio.js';

import {scaleVector} from './vector.js';
import {
  circleCells,
  cellsInCircle,
  cellsNotInCircle,
  gridValue
} from './grid.js';

import { walkInput } from './walk-input.js';
import { renderer } from './render.js';


const aEnv = createAudioEnvironment()


const entities = [
  // [[-90, -90], "C", 3],
  // [[-80, -95], "C", 2],
  // [[-85, -75], "G", 3],

  // [[-50, 0], "C", 4],
  // [[0, 50], "Eb", 4],
  // [[30, 30], "G", 4],
  // [[40, -30], "Bb", 4],
  // [[60, 80], "Bb", 3],
  // [[-75, 10], "C", 3],
  // [[-95, 20], "Eb", 3],
  // [[-65, -10], "G", 3],

  // [[15, 75], "D", 4],
].map(e => {
  const ent = createAudioEntity(e[0])
  ent.options.freq = noteFrequency(e[1], e[2])
  enableAudioEntity(aEnv, ent)

  return ent
})

const input = walkInput(document.querySelector('#walk-input'))
const render = renderer(document.querySelector('#renderer'))

let activeCells = []

const main = () => {
  const moveVec = scaleVector(input(), 8)
  const oldPosition = aEnv.listener.position
  const range = 80
  
  moveListenerBy(aEnv, moveVec)
  rotateListenerTo(aEnv, moveVec)
  render.clear()
  render.grid()

  const newPosition = aEnv.listener.position

  const activatingCells = cellsNotInCircle(circleCells(newPosition, range), oldPosition, range)
    .filter(c => gridValue(c) > 9000)
  const deactivatingCells = cellsNotInCircle(activeCells, newPosition, range)
  
  activeCells = cellsInCircle(activeCells, newPosition, range).concat(activatingCells)

  render.cells(activeCells, 'gray')
  render.cells(activatingCells, 'lightgreen')
  render.cells(deactivatingCells, 'red')

  render.listener(aEnv.listener)
  entities.forEach(ent => render.entity(ent.position))
}

setInterval(main, 1000/30)






document.querySelector('#audio-start').addEventListener('click', () => aEnv.audio.ctx.resume())
document.querySelector('#audio-stop').addEventListener('click', () => aEnv.audio.ctx.suspend())
