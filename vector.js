import {
  isNumber,
  isUndefined
} from './lib.js'

const {pow, sqrt, sin, cos, PI, atan2} = Math

export const isVector = n => v => {
  if (!Array.isArray(v)) {
    return false
  }

  if (v.length !== n) {
    return false
  }
  
  if (!isUndefined(v.find( n => !isNumber(n)))) {
    return false
  }

  return true
}

export const isVector2 = isVector(2)

{
  console.assert(isVector2([0,0]) === true, 'isVector2 ok')
}



export const validateVector2 = v => {
  if (!isVector2(v)) {
    throw new Error(`Invalid 2D vector [${v}]`)
  }
}

{
  try {
    validateVector2([0,0])
  } catch (e) {
    console.assert(false, 'validateVector2 should not throw')
  }

  try {
    validateVector2([0,'a'])
    console.assert(false, 'validateVector2 should throw')
  } catch (e) {
    console.assert(e.message === "Invalid 2D vector [0,a]", "validateVector2 should log an error")
  }
}



export const addVectors = (vA, vB) => [vA[0] + vB[0], vA[1] + vB[1]]

{
  const t = addVectors([1,2], [5,6])
  console.assert(t[0] === 6, "addVectors X")
  console.assert(t[1] === 8, "addVectors Y")
}



export const subtractVectors = (vA, vB) => [vA[0] - vB[0], vA[1] - vB[1]]

{
  const t = subtractVectors([8,5], [5,9])
  console.assert(t[0] === 3, "subtractVectors X")
  console.assert(t[1] === -4, "subtractVectors Y")
}



export const scaleVector = (v, s) => [v[0] * s, v[1] * s]
{
  const t = scaleVector([1,2], 5)
  console.assert(t[0] === 5, 'scaleVector X')
  console.assert(t[1] === 10, 'scaleVector Y')
}



export const vectorLength = v => sqrt(pow(v[0], 2) + pow(v[1], 2))

{
  console.assert(vectorLength([1,0]) === 1, 'vectorLength')
  console.assert(vectorLength([3,4]) === 5, 'vectorLength')
  console.assert(vectorLength([0,0]) === 0, 'vectorLength')
}



export const rotate2DVector = ([x, y], th) => {
  return [
      x * cos(th) - y * sin(th),
      x * sin(th) + y * cos(th)
  ]
}

{
  const t1 = rotate2DVector([1,0], PI)
  console.assert(t1[0] === -1, 'rotate2DVector')
  console.assert(t1[1] < 1e-15, 'rotate2DVector')
  const t2 = rotate2DVector([1,0], PI/2)
  console.assert(t2[0] < 1e-15, 'rotate2DVector')
  console.assert(t2[1] === 1, 'rotate2DVector')
}


export const vectorAngle = vec => {
  return atan2(vec[1], vec[0])
}


export const equalVector = (va, vb) => {
  if (va.length !== vb.length) {
    return false
  }

  if (va.find( (a, i) => a !== vb[i])) {
    return false
  }

  return true
}

{
  console.assert(equalVector([1, 0], [1, 0]), 'equalVector')
  console.assert(!equalVector([ 0, 0], [0, 0, 0]), 'equalVector')
  console.assert(!equalVector([1, 0], [2, 0]), 'equalVector')
}