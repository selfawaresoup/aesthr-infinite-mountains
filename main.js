import {
  createAudioEntity,
  enableAudioEntity,
  disableAudioEntity,
  createAudioEnvironment,
  moveListenerTo,
  noteFrequency,
  addVectors,
  scaleVector,
} from './lib.js';

import { walkInput } from './walk-input.js';
import { renderer } from './render.js';


const aEnv = createAudioEnvironment()


const entities = [
  [[-90, -90], "C", 3],
  [[-80, -95], "C", 2],
  [[-85, -75], "G", 3],

  [[-50, 0], "C", 4],
  [[0, 50], "Eb", 4],
  [[30, 30], "G", 4],
  [[40, -30], "Bb", 4],
  [[60, 80], "Bb", 3],
  [[-75, 10], "C", 3],
  [[-95, 20], "Eb", 3],
  [[-65, -10], "G", 3],

  [[15, 75], "D", 4],
].map(e => {
  const ent = createAudioEntity(e[0])
  ent.options.freq = noteFrequency(e[1], e[2])
  enableAudioEntity(aEnv, ent)

  return ent
})

const inputCoords = walkInput(document.querySelector('#walk-input'))
const render = renderer(document.querySelector('#renderer'))

let listener = [0, 0]

const main = () => {
  listener = addVectors(listener, scaleVector(inputCoords(), 4))
  //console.log(listener)
  moveListenerTo(aEnv, listener)
  render.clear()
  render.listener(listener)
  entities.forEach(ent => render.entity(ent.position))
}

setInterval(main, 1000/60)






document.querySelector('#audio-start').addEventListener('click', () => aEnv.audio.ctx.resume())
document.querySelector('#audio-stop').addEventListener('click', () => aEnv.audio.ctx.suspend())
