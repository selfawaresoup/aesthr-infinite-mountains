export const isUndefined = x => typeof x === 'undefined'

{
  console.assert( isUndefined([ ][0]), 'isUndefined true')
  console.assert(!isUndefined([1][0]), 'isUndefined false')
}


export const isNumber = x => typeof x === 'number' && !Number.isNaN(x) && Number.isFinite(x)

{
  console.assert( isNumber(1), 'isNumber true')
  console.assert( !isNumber(1/0), 'isNumber for Infitiy: false')
  console.assert( !isNumber(0/0), 'isNumber for NaN: false')
}


export const isFunction = x => typeof x === 'function'

{
  console.assert( isFunction(() => {}), 'isFunction true')
  console.assert( !isFunction(1), 'isFunction false')
}


export const isVector = n => v => {
  if (!Array.isArray(v)) {
    return false
  }

  if (v.length !== n) {
    return false
  }
  
  if (!isUndefined(v.find( n => !isNumber(n)))) {
    return false
  }

  return true
}

export const isVector2 = isVector(2)
export const isVector3 = isVector(3)
{
  console.assert(isVector2([0,0]) === true, 'isVector2 ok')
  console.assert(isVector3([0,0,0]) === true, 'isVector3 ok')
  console.assert(isVector3([0,0]) === false, 'isVector3 with wrong length')
  console.assert(isVector3([0,0, '']) === false, 'isVector3 with wrong type')
  console.assert(isVector3([0,0, 'a']) === false, 'isVector3 with wrong type')
}



export const validateVector2 = v => {
  if (!isVector2(v)) {
    throw new Error(`Invalid 2D vector [${v}]`)
  }
}

{
  try {
    validateVector2([0,0])
  } catch (e) {
    console.assert(false, 'validateVector2 should not throw')
  }

  try {
    validateVector2([0,'a'])
    console.assert(false, 'validateVector2 should throw')
  } catch (e) {
    console.assert(e.message === "Invalid 2D vector [0,a]", "validateVector2 should log an error")
  }
}



export const addVectors = (vA, vB) => vA.map((n, i) => n + vB[i])

{
  const t = addVectors([1,2], [5,6])
  console.assert(t[0] === 6, "addVectors X")
  console.assert(t[1] === 8, "addVectors Y")
}



export const scaleVector = (v, s) => v.map(n => n * s)
{
  const t = scaleVector([1,2], 5)
  console.assert(t[0] === 5, 'scaleVector X')
  console.assert(t[1] === 10, 'scaleVector Y')
}



const setAudioListenerPosition = (ctx, lst, v) => {
  validateVector2(v)
  lst.positionX.setTargetAtTime(v[0], ctx.currentTime, 0.02)
  lst.positionZ.setTargetAtTime(v[1], ctx.currentTime, 0.02)
  return lst
}

const setAudioPannerPosition = setAudioListenerPosition



const setAudioListenerDirection = (lst, v) => {
  validateVector2(v)
  lst.forwardX.value = v[0]
  lst.forwardZ.value = v[1]
  return lst
}

{
  const testLst = {
    forwardX: {value: 0},
    forwardZ: {value: 0}
  }
  setAudioListenerDirection(testLst, [1,2])
  console.assert(testLst.forwardX.value === 1, 'setAudioListenerDirection X')
  console.assert(testLst.forwardZ.value === 2, 'setAudioListenerDirection Z')
}



const createPanner = (ctx, maxDistance = 80) => {
  const pan = ctx.createPanner()
  pan.panningModel = 'HRTF'
  pan.distanceModel = 'inverse'
  pan.refDistance = 1
  pan.maxDistance = maxDistance
  pan.rolloffFactor = 1
  pan.coneInnerAngle = 360
  pan.coneOuterAngle = 0
  pan.coneOuterGain = 0
  return pan
}



const createOscillator = (ctx, freq = 440) => {
  const osc = ctx.createOscillator()
  osc.frequency.value = freq
  osc.type = 'sine'
  osc.start(0)
  return osc
}



const createGain = (ctx, g = 0.5) => {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(g, ctx.currentTime)
  return gain
}



export const createAudioEntity = (position) => {
  validateVector2(position)
  return {
    position: position,
    enabled: false,
    gain: 0.5,
    type: 'basic-sine',
    options: {
      freq: 440
    },
    audio: {
      panner: null,
      gain: null,
      nodes: []
    }
  }
}



export const enableAudioEntity = (env, ent) => {
  const { ctx } = env.audio
  const pan = createPanner(ctx)
  setAudioPannerPosition(ctx, pan, ent.position)
  const osc = createOscillator(ctx, ent.options.freq)
  const gain = createGain(ctx, ent.gain)

  osc.connect(gain)
  gain.connect(pan)
  pan.connect(env.audio.gain)

  ent.audio.panner = pan
  ent.audio.gain = gain
  ent.audio.nodes = [osc]
}



const disconnectNode = n => {
  if (n && isFunction(n.disconnect)) {
    n.disconnect()
  }
  return n
}

{
  let c = true
  const n1 = {disconnect: () => c = false}
  disconnectNode(n1)
  console.assert(c === false, 'disconnectNode')

  c = true
  const n2 = {}
  disconnectNode(n2)
  console.assert(c === true, 'disconnectNode')
}



export const disableAudioEntity = ent => {
  [ent.audio.panner, ent.audio.gain, ...ent.audio.nodes].forEach(disconnectNode)
  ent.audio.panner = null,
  ent.audio.gain = null,
  ent.audio.nodes = []
  return ent
}

{
  let connections = 4
  const disconnect = () => connections--
  const ent = {
    audio: {
      panner: { disconnect },
      gain: { disconnect },
      nodes: [
        { disconnect },
        { disconnect },
      ]
    }
  }
  disableAudioEntity(ent)
  console.assert(connections === 0, 'disableAudioEntity connections')
  console.assert(ent.audio.panner === null, 'disableAudioEntity panner')
  console.assert(ent.audio.gain === null, 'disableAudioEntity gain')
  console.assert(ent.audio.nodes.length === 0, 'disableAudioEntity nodes')
}



export const createAudioEnvironment = () => {
  const ctx = new AudioContext()
  const lst = ctx.listener

  setAudioListenerPosition(ctx, lst, [0,0])
  setAudioListenerDirection(lst, [0,-1])

  const gain = createGain(ctx, 0.5)
  gain.connect(ctx.destination)

  return {
    listener: [0,0],
    audio: {
      ctx,
      lst,
      gain
    }
  }
}



export const moveListenerTo = (env, vec) => {
  env.listener = vec
  setAudioListenerPosition(env.audio.ctx, env.audio.lst, env.listener)
}



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
    case  "b": return 5
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

