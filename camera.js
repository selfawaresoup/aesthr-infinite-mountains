import {
  vectorAngle,
  subtractVectors,
  rotate2DVector,
  scaleVector,
  vectorLength,
  addVectors
} from './vector.js';

const { floor, PI }  = Math

export const camera = canvas => {
  const ctx = canvas.getContext('2d')
  const bounds = canvas.getBoundingClientRect()
  const { width, height } = canvas
  ctx.font = '10px sans-serif';

  const scale = 10

  const bufferWidth = width / scale
  const bufferHeight = height / scale
  const bufferLength = bufferWidth * bufferHeight
  const buffer = Array.from({length: bufferLength}).fill(0)
  let oldBuffer = Array.from({length: bufferLength}).fill(0)
  const bufferOrigin = [bufferWidth/2, bufferHeight - 10]

  const clear = () => ctx.clearRect(0, 0, bounds.width, bounds.height)

  const [originX, originY] = bufferOrigin

  const bufferOffset = ([x, y]) => {
    const bx = floor(originX + x)
    const by = floor(originY - y)
    if (bx < 0 || bx >= bufferWidth || by < 0 || by >= bufferHeight) {
      return -1
    }
    return by * bufferWidth + bx
  }
  console.log(bufferWidth, bufferHeight, bufferOrigin ,bufferOffset([2,0]))

  const drawEntity = (vec, ent, value) => {
    const scaled = scaleVector(vec, 0.1)
    const range = 5
    for (let y = -range; y <= range; y++) {
      for (let x = -range; x <= range; x++) {
        const d = 4 * vectorLength([x,y]) + 1
        const adjusted = value / d
        setBufferValue(addVectors(scaled, [x,y]), adjusted)
      }
    }
  }


  const setBufferValue = (vec, value) => {
    const offset = bufferOffset(vec)
    if (offset < 0 || offset >= bufferLength) {
      return
    }
    buffer[offset] += value
  }

  const renderBuffer = () => {
    buffer.forEach((newValue, i) => {
      const x = scale * (i % bufferWidth)
      const y = scale * floor(i / bufferWidth)

      const oldValue = oldBuffer[i]
      const n = oldValue + (newValue - oldValue) / 10
      oldBuffer[i] = n

      ctx.fillStyle = `rgb(${n}, 0,0)`
      ctx.fillRect(x, y, scale, scale)
    })
    buffer.fill(0)
  }

  return {
    entity: (env, ent, meter) => {
      const cameraAngle = vectorAngle(env.listener.orientation)
      //ctx.fillStyle = 'green'
      //ctx.fillText(`${cameraAngle}`, 10, 10)
      const translated = subtractVectors(ent.position, env.listener.position)
      const rotated = rotate2DVector(translated, -cameraAngle + PI/2)
      //ctx.fillText(`${vectorAngle(rotated)}`, 10, 30)
      drawEntity(rotated, ent, meter)
    },
    renderBuffer,
    clear
  }
}