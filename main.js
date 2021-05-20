import {
  createAudioEntity,
  enableAudioEntity,
  disableAudioEntity,
  createAudioEnvironment,
  moveListenerBy,
  rotateListenerBy,
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

const input = walkInput(document.querySelector('#camera'))
//const render = renderer(document.querySelector('#renderer'))
const cameraRender = camera(document.querySelector('#camera'))
//const debug = document.querySelector('#debug-stats')
const range = 240

activateEntities([1000,1000], [0,0], range)

const main = () => {
  const [xin, yin] = input()
  const speed = yin * 2
  const rotation = - xin / 8
  const oldPosition = aEnv.listener.position
  
  
  moveListenerBy(aEnv, scaleVector(aEnv.listener.orientation, speed))
  rotateListenerBy(aEnv, rotation)
  //render.clear()
  //render.grid()
  
  const newPosition = aEnv.listener.position
  
  deactivateEntities(newPosition, range)
  activateEntities(oldPosition, newPosition, range)
  
  //render.listener(aEnv.listener)
  
  activeEntities.forEach(ent => {
    const m = meter(ent)
    //render.entity(ent.position, m)  
    cameraRender.entity(aEnv, ent, m)
  })

  cameraRender.renderBuffer()
  //debugStats()
}

setInterval(main, 1000/30)






document.querySelector('#audio-start').addEventListener('click', () => aEnv.audio.ctx.resume())
document.querySelector('#audio-stop').addEventListener('click', () => aEnv.audio.ctx.suspend())
