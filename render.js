import { scaleVector } from './vector.js';

export const renderer = canvas => {
  const ctx = canvas.getContext('2d')
  const bounds = canvas.getBoundingClientRect()
  const { width, height } = bounds
  const cx = width / 2
  const cy = height / 2

  const clear = () => ctx.clearRect(0, 0, bounds.width, bounds.height)

  const line = (x1, y1, x2, y2) => {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  const listener = lst => {
    const [x, y] = lst.position
    const [dx, dy] = scaleVector(lst.orientation, 16)
    const lx = cx + x
    const ly = cy + y
    ctx.fillStyle = 'purple'
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, 360);
    ctx.fill()
    ctx.strokeStyle='purple'
    line(lx, ly, lx + dx, ly + dy)
    ctx.beginPath()
    ctx.moveTo(lx, ly)
    ctx.lineTo(lx + dx, ly + dy)
    ctx.stroke()
  }

  const entity = ([x,y], v) => {
    ctx.strokeStyle = 'green'
    ctx.strokeRect(cx + x, cy + y, 10, 10)

    ctx.fillStyle = `rgb(0, ${v}, 0)`
    ctx.fillRect(cx + x, cy + y, 10, 10)
  }

  const grid = () => {
    const d = 10
    ctx.strokeStyle = 'lightgray'
      
    for (let y = cy; y > 0; y -= d) {
      line(0, y, width, y)
    }

    for (let y = cy + d; y < height; y += d) {
      line(0, y, width, y)
    }

    for (let x = cx; x > 0; x -= d) {
      line(x, 0, x, height)
    }

    for (let x = cx + d; x < width; x += d) {
      line(x, 0, x, height)
    }
  }

  const cells = (cls, color) => {
    ctx.fillStyle = color
    cls.forEach(([x, y]) => {
      ctx.fillRect(cx + x, cy + y, 10, 10)
    })
  }

  return {
    clear,
    grid,
    cells,
    listener,
    entity
  }
}

