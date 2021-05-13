export const renderer = canvas => {
  const ctx = canvas.getContext('2d')
  const bounds = canvas.getBoundingClientRect()
  const cX = bounds.width / 2
  const cY = bounds.height / 2

  const clear = () => ctx.clearRect(0, 0, bounds.width, bounds.height)

  const listener = ([x,y]) => {
    ctx.fillStyle = 'purple'
    ctx.fillRect(cX + x - 4, cY + y - 4, 8, 8)
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

