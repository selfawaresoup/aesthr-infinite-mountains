import {
  vectorAngle,
  subtractVectors,
  rotate2DVector,
  scaleVector,
  vectorLength,
  addVectors
} from './vector.js';

import { random1 } from './lib.js'

const { floor, PI, pow, exp }  = Math

export const camera = canvas => {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas

  const scale = 10

  const bufferWidth = width / scale
  const bufferHeight = height / scale
  const bufferLength = bufferWidth * bufferHeight
  const buffer = Array.from({length: bufferLength}).fill(0)
  const nextBuffer = Array.from({length: bufferLength}).fill(0)
  const bufferOrigin = [bufferWidth/2, bufferHeight - 10]

  const clear = () => {
    ctx.clearRect(0, 0, width, height)
  }

  const [originX, originY] = bufferOrigin

  const bufferOffset = ([x, y]) => {
    const bx = floor(originX + x)
    const by = floor(originY - y)
    if (bx < 0 || bx >= bufferWidth || by < 0 || by >= bufferHeight) {
      return -1
    }
    return by * bufferWidth + bx
  }
  
  const drawEntity = (vec, value, seed) => {
    const scaled = scaleVector(vec, 0.1)
    const range = 10
    for (let y = -range; y <= range; y++) {
      for (let x = -range; x <= range; x++) {
        const distance = vectorLength([x,y]) - 1
        const c = 1 + random1(seed, 100) / 40
        const vsqr = pow(value / 256, 2) * 256
        const adjusted = 1.4 * vsqr * exp(-pow(distance, 2) / (2 * pow(c,2))) // gaussian curve
        setBufferValue(addVectors(scaled, [x,y]), adjusted)
      }
    }
  }

  const setBufferValue = (vec, value) => {
    const offset = bufferOffset(vec)
    if (offset < 0 || offset >= bufferLength) {
      return
    }
    nextBuffer[offset] += value
  }

  const renderBufferGrid = () => {
    buffer.forEach((n, i) => {
      const x = scale * (i % bufferWidth)
      const y = scale * floor(i / bufferWidth)
      ctx.fillStyle = `rgb(${n}, 0,0)`
      ctx.fillRect(x, y, scale, scale)
    })
  }

  const renderCurves = () => {
    clear()
    const xScale = scale
    const yScale = 8
    const frontScale = 2.0
    const rearScale = 0.5

    ctx.strokeStyle = 'rgba(10,0,50,0.5)'
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'
    ctx.shadowColor = 'rgba(255,0,120,0.4)'
    ctx.shadowBlur = 5

    for (let by = 0; by < bufferHeight; by++) {
      const y = height - yScale * (bufferHeight - by)
      const lineScale = rearScale + frontScale * (by) / bufferHeight

      ctx.beginPath()
      ctx.moveTo(-10, y)

      let prevX = 0
      let prevY = y
      
      for (let bx = 0; bx <= bufferWidth; bx++) {
        const x = (width - lineScale * width) / 2 + lineScale * xScale * bx 
        const v = buffer[by * bufferWidth + bx]
        const yv = y - 0.2*v
        //ctx.lineTo(x, yv)
        const controlX1 = prevX + (x - prevX) / 2.5
        const controlY1 = prevY
        const controlX2 = x - (x - prevX) / 2.5
        const controlY2 = yv
        ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, x, yv)
        prevX = x
        prevY = yv
      }

      ctx.lineTo(width + 10, y)
      ctx.lineTo(width + 10, height + 10)
      ctx.lineTo(-10, height + 10)
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
      
    }
  }

  const renderBuffer = () => {
    nextBuffer.forEach((newValue, i) => {
      const oldValue = buffer[i]
      const n = oldValue + (newValue - oldValue) / 1.5
      buffer[i] = n
    })

    
    renderCurves()
    //renderBufferGrid()
    nextBuffer.fill(0)
  }

  return {
    entity: (env, ent, meter) => {
      const cameraAngle = vectorAngle(env.listener.orientation)
      const translated = subtractVectors(ent.position, env.listener.position)
      const rotated = rotate2DVector(translated, -cameraAngle + PI/2)
      drawEntity(rotated, meter, ent.seed)
    },
    renderBuffer,
    clear
  }
}