import {
  createAudioEntity,
  enableAudioEntity,
  disableAudioEntity,
  createAudioEnvironment,
  moveListenerBy,
  rotateListenerTo,
  meter
} from './audio.js';

import {scaleVector, vectorAngle} from './vector.js';
import {
  circleCells,
  cellsInCircle,
  cellsNotInCircle,
  isCellNotInCircle,
  gridValue
} from './grid.js';

import { walkInput } from './walk-input.js';
import { renderer } from './render.js';
import { camera } from './camera.js'

const aEnv = createAudioEnvironment()

let activeEntities = []

const activateEntities = (oldPosition, newPosition, range) => {
  const activatingCells = cellsNotInCircle(circleCells(newPosition, range), oldPosition, range)

  activatingCells.forEach(c => {
    const v = gridValue(c)
    if (v > 0) {
      const ent = createAudioEntity(c, v)
      activeEntities.push(ent)
      enableAudioEntity(aEnv, ent)
    }
  })
}

const deactivateEntities = (newPosition, range) => {
  const remaining = []
  activeEntities.forEach(ent => {
    if (isCellNotInCircle(newPosition, range)(ent.position)) {
      disableAudioEntity(aEnv, ent)
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
const cameraRender = camera(document.querySelector('#camera'))
const debug = document.querySelector('#debug-stats')

const main = () => {
  const moveVec = scaleVector(input(), 8)
  const oldPosition = aEnv.listener.position
  const range = 120
  
  moveListenerBy(aEnv, moveVec)
  rotateListenerTo(aEnv, moveVec)
  render.clear()
  render.grid()
  
  const newPosition = aEnv.listener.position
  
  deactivateEntities(newPosition, range)
  activateEntities(oldPosition, newPosition, range)
  
  render.listener(aEnv.listener)
  cameraRender.clear()

  activeEntities.forEach(ent => {
    render.entity(ent.position, meter(ent))  
    cameraRender.entity(aEnv, ent)
  })



  debugStats()
}

setInterval(main, 1000/30)






document.querySelector('#audio-start').addEventListener('click', () => aEnv.audio.ctx.resume())
document.querySelector('#audio-stop').addEventListener('click', () => aEnv.audio.ctx.suspend())
