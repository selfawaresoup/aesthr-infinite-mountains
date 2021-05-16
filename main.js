import {
  createAudioEntity,
  enableAudioEntity,
  disableAudioEntity,
  createAudioEnvironment,
  moveListenerBy,
  noteFrequency,
  rotateListenerTo,
  noteByNumber
} from './audio.js';

import {scaleVector} from './vector.js';
import {
  circleCells,
  cellsInCircle,
  cellsNotInCircle,
  isCellNotInCircle,
  gridValue
} from './grid.js';

import { walkInput } from './walk-input.js';
import { renderer } from './render.js';


const aEnv = createAudioEnvironment()

let activeEntities = []

const activateEntities = (oldPosition, newPosition, range) => {
  const activatingCells = cellsNotInCircle(circleCells(newPosition, range), oldPosition, range)

  activatingCells.forEach(c => {
    const v = gridValue(c)
    if (v > 0) {
      const ent = createAudioEntity(c)
      ent.options.freq = noteByNumber(v)
      activeEntities.push(ent)
      enableAudioEntity(aEnv, ent)
    }
  })
}

const deactivateEntities = (newPosition, range) => {
  const remaining = []
  activeEntities.forEach(ent => {
    if (isCellNotInCircle(newPosition, range)(ent.position)) {
      disableAudioEntity(ent)
    } else {
      remaining.push(ent)
    }
  })
  
  activeEntities = remaining
}


const debugStats = () => {
  debug.textContent = `activeEntities: ${activeEntities.length}`
}

const input = walkInput(document.querySelector('#renderer'))
const render = renderer(document.querySelector('#renderer'))
const debug = document.querySelector('#debug-stats')

const main = () => {
  const moveVec = scaleVector(input(), 8)
  const oldPosition = aEnv.listener.position
  const range = 80
  
  moveListenerBy(aEnv, moveVec)
  rotateListenerTo(aEnv, moveVec)
  render.clear()
  render.grid()
  
  const newPosition = aEnv.listener.position
  
  deactivateEntities(newPosition, range)
  activateEntities(oldPosition, newPosition, range)
  
  render.listener(aEnv.listener)
  activeEntities.forEach(ent => render.entity(ent.position))

  debugStats()
}

setInterval(main, 1000/30)






document.querySelector('#audio-start').addEventListener('click', () => aEnv.audio.ctx.resume())
document.querySelector('#audio-stop').addEventListener('click', () => aEnv.audio.ctx.suspend())
