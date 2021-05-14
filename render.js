import { scaleVector } from './vector.js'

export const renderer = canvas => {
  const ctx = canvas.getContext('2d')
  const bounds = canvas.getBoundingClientRect()
  const cX = bounds.width / 2
  const cY = bounds.height / 2

  const clear = () => ctx.clearRect(0, 0, bounds.width, bounds.height)

  const listener = lst => {
    const [x, y] = lst.position
    const [dx, dy] = scaleVector(lst.orientation, 16)
    ctx.fillStyle = 'purple'
    ctx.beginPath();
    ctx.arc(cX + x, cY + y, 4, 0, 360);
    ctx.fill()
    ctx.strokeStyle='purple'
    ctx.beginPath()
    ctx.moveTo(cX + x, cY + y)
    ctx.lineTo(cX + x + dx, cY + y + dy)
    ctx.stroke()
  }

  const entity = ([x,y]) => {
    ctx.fillStyle = 'green'
    ctx.beginPath();
    ctx.arc(cX + x, cY + y, 8, 0, 360);
    ctx.fill()
  }

  return {
    clear,
    listener,
    entity
  }
}

