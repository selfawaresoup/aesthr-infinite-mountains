import {
  validateVector2,
  rotate2DVector,
  addVectors
} from './vector.js';

import { isFunction } from './lib.js';

import { createAudioSource } from './audio-sources.js';

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
  pan.panningModel = 'equalpower'
  pan.distanceModel = 'exponential'
  pan.refDistance = 6
  pan.maxDistance = 80
  pan.rolloffFactor = 2.5
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
  return {
    position: position,
    seed,
    enabled: false,
    gain: 0.5,
    type: 'basic-sine',
    options: {
      freq: 440
    },
    audio: {
      panner: null,
      gain: null,
      analyzer: null,
      nodes: []
    }
  }
}



const fadeInTime = 300
export const enableAudioEntity = (env, ent) => {
  const { ctx } = env.audio
  const pan = createPanner(ctx)
  setAudioPannerPosition(ctx, pan, ent.position)

  const source = createAudioSource(ctx, ent.seed)
  const sourceOutput = source[0]
  const gain = createGain(ctx, 0)
  const analyzer = ctx.createAnalyser()

  sourceOutput.connect(gain)
  gain.connect(pan)
  gain.connect(analyzer)
  pan.connect(env.audio.gain)

  gain.gain.exponentialRampToValueAtTime(ent.gain, ctx.currentTime + fadeInTime / 1000)

  ent.audio.panner = pan
  ent.audio.gain = gain
  ent.audio.analyzer = analyzer
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


const fadeOutTime = 200
export const disableAudioEntity = (env, ent) => {
  const nodes = [ent.audio.panner, ent.audio.gain, ent.audio.analyzer, ...ent.audio.nodes]

  ent.audio.gain.gain.linearRampToValueAtTime(0, env.audio.ctx.currentTime + fadeOutTime/1000)

  ent.audio.panner = null,
  ent.audio.gain = null,
  ent.audio.nodes = []

  const timer = setTimeout(() => {
    clearTimeout(timer)
    nodes.forEach(disconnectNode)
  }, fadeOutTime)

  return ent
}



export const createAudioEnvironment = () => {
  const ctx = new AudioContext()
  const lst = ctx.listener

  setAudioListenerPosition(ctx, lst, [1,1])
  setAudioListenerDirection(ctx, lst, [0,-1])

  const gain = createGain(ctx, 0.5)
  gain.connect(ctx.destination)

  return {
    listener: {
      position: [1,1],
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
  setAudioListenerDirection(env.audio.ctx, env.audio.lst, b)
}

export const rotateListenerTo = (env, vec) => {
  env.listener.orientation = vec
  setAudioListenerDirection(env.audio.ctx, env.audio.lst, vec)
}


