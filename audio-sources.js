import { random1 } from './lib.js';


const pitches = [
  261.63, //c
  277.18,  //cs, df
  293.66, //d
  311.13, //ds, ef
  329.63, //e
  349.23, //f
  369.99, //fs, gf
  392.00, //g
  415.30, //gs, af
  440.00, //a
  466.16, //as, bf
  493.88, //b
]

const frequencyIndex = note => {
  switch (note) {
    case  "C": return 0
    case "C#":
    case "Db": return 1
    case  "D": return 2
    case "D#":
    case "Eb": return 3
    case  "E": return 4
    case  "F": return 5
    case "F#":
    case "Gb": return 6
    case  "G": return 7
    case "G#":
    case "Ab": return 8
    case  "A": return 9
    case "A#":
    case "Bb": return 10
    case  "B": return 11
    default:
      throw new Error(`Unknown note "${note}"`)
  }
}

export const noteFrequency = (note, octave = 4) => {
  return pitches[frequencyIndex(note)] * Math.pow(2, octave - 4)
}

{
  console.assert(noteFrequency('A') === 440, 'noteFrequency A4')
  console.assert(noteFrequency('A', 5) === 880, 'noteFrequency A5')
  console.assert(noteFrequency('G#', 2) === 103.825, 'noteFrequency G#2')
  console.assert(noteFrequency('C', 8) === 4186.08, 'noteFrequency C8')
}


const scale = ["D", "E", "F", "G","A", "Bb", "C"]
export const noteByNumber = n => {
  const note = scale[n % 7]
  const octave = n % 5

  return noteFrequency(note, octave)
}

export const createAudioSource = (ctx, seed) => {
  const type = 1

  return [
    createConstantSine,
    createPulsingSine
  ][type](ctx, seed)
}

const createOscillator = (ctx, freq) => {
  
  const osc = ctx.createOscillator()
  osc.frequency.value = freq
  osc.type = 'sine'
  osc.start()
  return osc
}

const createConstantSine = (ctx, seed) => {
  const freq = noteByNumber(seed)
  return [createOscillator(ctx, freq)]
}

const createPulsingSine = (ctx, seed) => {
  const baseFreq = ctx.createConstantSource()
  baseFreq.offset.value = noteByNumber(seed)
  baseFreq.start()

  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = random1(seed, 10)

  const attenuator = ctx.createGain()
  attenuator.gain.value = 20

  lfo.connect(attenuator)
  lfo.start()

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.start()
  
  baseFreq.connect(osc.frequency)
  attenuator.connect(osc.frequency)

  return [osc, lfo, baseFreq, attenuator]
}