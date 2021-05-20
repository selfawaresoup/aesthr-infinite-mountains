export const walkInput = (canvas, callback) => {
  const ctx = canvas.getContext('2d')
  const {width, height, left, top} = canvas.getBoundingClientRect()
  let cX = width / 2
  let cY = height / 2
  let outX = 0
  let outY = 0
  let x = cX
  let y = cY
  let active = false

  canvas.addEventListener('mousedown', (ev) => {
    cX = ev.clientX - left
    cY = ev.clientY - top
    active = true
    update()
    //draw()
  })

  canvas.addEventListener('mouseup', () => {
    active = false
    release()
  })
  
  canvas.addEventListener('mouseleave', () => {
    release()
    //clear()
  })

  const clear = () => ctx.clearRect(0, 0, width, height)

  const update = () => {
    outX = 2* (x - cX) / width
    outY = 2* (cY - y) / height
  }

  const release = () => {
    active = false
    outX = 0
    outY = 0
  }

  const draw = () => {
    clear()

    ctx.strokeStyle = active ? 'purple' : 'lightgrey'
    
    ctx.beginPath()
    ctx.moveTo(cX, cY)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  canvas.addEventListener("mousemove", ev => {
    x = ev.clientX - left
    y = ev.clientY - top

    if (active) {
      update()
    }

    //draw()
  })

  return () => {
    return [outX, outY]
  }
}
