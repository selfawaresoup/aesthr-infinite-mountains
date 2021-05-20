import {
  validateVector2,
  rotate2DVector,
  addVectors,
  vectorAngle
} from './vector.js';

import { isFunction, random1 } from './lib.js';

import { createAudioSource } from './audio-sources.js';

const { max, pow } = Math

const setAudioListenerPosition = (ctx, lst, v) => {
  validateVector2(v)
  lst.positionX.setTargetAtTime(v[0], ctx.currentTime, 0.01)
  lst.positionZ.setTargetAtTime(v[1], ctx.currentTime, 0.01)
  return lst
}

const setAudioPannerPosition = setAudioListenerPosition



const setAudioListenerDirection = (ctx, lst, v) => {
  validateVector2(v)
  lst.forwardX.setTargetAtTime(v[0], ctx.currentTime, 0.01)
  lst.forwardZ.setTargetAtTime(v[1], ctx.currentTime, 0.01)
  return lst
}



const createPanner = (ctx) => {
  const pan = ctx.createPanner()
  pan.panningModel = 'hrtf'
  pan.distanceModel = 'exponential'
  pan.refDistance = 1
  pan.maxDistance = 80
  pan.rolloffFactor = 1.6
  pan.coneInnerAngle = 360
  pan.coneOuterAngle = 0
  pan.coneOuterGain = 0
  return pan
}






const createGain = (ctx, g = 0.5) => {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(g, ctx.currentTime)
  return gain
}



export const createAudioEntity = (position, seed) => {
  validateVector2(position)
  const g = pow(random1(seed, 1000) / 1000, 8)

  return {
    position: position,
    seed,
    enabled: false,
    gain: g,
    type: 'basic-sine',
    options: {
      freq: 440
    },
    audio: {
      panner: null,
      gain: null,
      analyser: null,
      nodes: []
    }
  }
}


const createAnalyser = ctx => {
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 32
  return analyser
}


export const meter = ent => {
  const { analyser } = ent.audio
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  return dataArray.reduce((carry, n) => max(carry, n), 0)
}



export const enableAudioEntity = (env, ent) => {
  const { ctx } = env.audio
  const pan = createPanner(ctx)
  setAudioPannerPosition(ctx, pan, ent.position)

  const source = createAudioSource(ctx, ent.seed)
  const sourceOutput = source[0]
  const gain = createGain(ctx, 0)

  const analyser = createAnalyser(ctx)
  
  sourceOutput.connect(gain)
  gain.connect(pan)
  gain.connect(analyser)
  pan.connect(env.audio.gain)
  
  gain.gain.setTargetAtTime(ent.gain, env.audio.ctx.currentTime, 0.2)

  ent.audio.panner = pan
  ent.audio.gain = gain
  ent.audio.analyser = analyser
  ent.audio.nodes = [...source]
}



const disconnectNode = node => {
  if (!node) {
    return
  }

  if (isFunction(node.disconnect)) {
    node.disconnect()
  }

  if (isFunction(node.stop)) {
    node.stop()
  }
}


export const disableAudioEntity = (env, ent) => {
  const nodes = [ent.audio.panner, ent.audio.gain, ent.audio.analyser, ...ent.audio.nodes]

  ent.audio.gain.gain.setTargetAtTime(0, env.audio.ctx.currentTime, 0.4)

  ent.audio.panner = null,
  ent.audio.gain = null,
  ent.audio.nodes = []

  const timer = setTimeout(() => {
    clearTimeout(timer)
    nodes.forEach(disconnectNode)
  }, 2000)

  return ent
}



export const createAudioEnvironment = () => {
  const ctx = new AudioContext()
  const lst = ctx.listener

  setAudioListenerPosition(ctx, lst, [1,1])
  setAudioListenerDirection(ctx, lst, [0,-1])

  const gain = createGain(ctx, 4)

  const compressor = ctx.createDynamicsCompressor()
  compressor.threshold.setValueAtTime(-40, ctx.currentTime)
  compressor.knee.setValueAtTime(0, ctx.currentTime)
  compressor.ratio.setValueAtTime(24, ctx.currentTime)
  compressor.attack.setValueAtTime(0, ctx.currentTime)
  compressor.release.setValueAtTime(0.25, ctx.currentTime)

  gain.connect(compressor)
  
  const splitter = ctx.createChannelSplitter(2)
  const merger = ctx.createChannelMerger(2)
  
  compressor.connect(splitter)
  splitter.connect(merger, 0, 1) // flip channels because coordinate system is flipped for rendering
  splitter.connect(merger, 1, 0)
  merger.connect(ctx.destination)

  return {
    listener: {
      position: [0,0],
      orientation: [0,1]
    },
    audio: {
      ctx,
      lst,
      gain
    }
  }
}



export const moveListenerTo = (env, vec) => {
  env.listener.position = vec
  setAudioListenerPosition(env.audio.ctx, env.audio.lst, env.listener.position)
}

export const moveListenerBy = (env, vec) => {
  const a = env.listener.position
  const b = addVectors(a, vec)
  env.listener.position = b
  setAudioListenerPosition(env.audio.ctx, env.audio.lst, b)
}

export const rotateListenerBy = (env, th) => {
  const a = env.listener.orientation
  const b = rotate2DVector(a, th)
  env.listener.orientation = b
  //console.log(vectorAngle(b))
  setAudioListenerDirection(env.audio.ctx, env.audio.lst, b)
}

export const rotateListenerTo = (env, vec) => {
  env.listener.orientation = vec
  setAudioListenerDirection(env.audio.ctx, env.audio.lst, vec)
}


