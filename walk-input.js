export const walkInput = (canvas, callback) => {
  const ctx = canvas.getContext('2d')
  const {width, height, left, top} = canvas.getBoundingClientRect()
  const cX = width / 2
  const cY = height / 2
  let outX = 0
  let outY = 0
  let x = cX
  let y = cY
  let active = false

  canvas.addEventListener('mousedown', () => {
    active = true
    update()
  })

  canvas.addEventListener('mouseup', () => {
    active = false
    release()
  })
  
  canvas.addEventListener('mouseleave', () => {
    release()
    clear()
  })

  const clear = () => ctx.clearRect(0, 0, width, height)

  const update = () => {
    outX = x - cX
    outY = cY - y
  }

  const release = () => {
    active = false
    outX = 0
    outY = 0
  }

  canvas.addEventListener("mousemove", ev => {
    x = ev.clientX - left
    y = ev.clientY - top

    if (active) {
      update()
    }

    clear()

    ctx.strokeStyle = active ? 'purple' : 'lightgrey'
    
    ctx.beginPath()
    ctx.moveTo(cX, cY)
    ctx.lineTo(x, y)
    ctx.stroke()
  })

  return () => {
    return [outX/width, -outY/height]
  }
}
