import {
  vectorAngle,
  subtractVectors,
  rotate2DVector,
  vectorLength
} from './vector.js';

const { PI } = Math

export const camera = canvas => {
  const ctx = canvas.getContext('2d')
  const bounds = canvas.getBoundingClientRect()
  const { width, height } = bounds
  const cx = width / 2

  const clear = () => ctx.clearRect(0, 0, bounds.width, bounds.height)

  const drawEntity = ([ex,ey]) => {
    ctx.fillStyle = 'green'

    const x = cx - ex
    const y = height - 20 - ey

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 360)
    ctx.fill()
  }

  return {
    entity: (env, ent) => {
      const cameraAngle = vectorAngle(env.listener.orientation)

      const translated = subtractVectors(ent.position, env.listener.position)
      const rotated = rotate2DVector(translated, cameraAngle)

      drawEntity(rotated)
      
    },
    clear
  }
}