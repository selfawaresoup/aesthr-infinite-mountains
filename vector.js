import {
  isNumber,
  isUndefined
} from './lib.js'

const {pow, sqrt, sin, cos, PI} = Math

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
export const isVector3 = isVector(3)
{
  console.assert(isVector2([0,0]) === true, 'isVector2 ok')
  console.assert(isVector3([0,0,0]) === true, 'isVector3 ok')
  console.assert(isVector3([0,0]) === false, 'isVector3 with wrong length')
  console.assert(isVector3([0,0, '']) === false, 'isVector3 with wrong type')
  console.assert(isVector3([0,0, 'a']) === false, 'isVector3 with wrong type')
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



export const addVectors = (vA, vB) => vA.map((n, i) => n + vB[i])

{
  const t = addVectors([1,2], [5,6])
  console.assert(t[0] === 6, "addVectors X")
  console.assert(t[1] === 8, "addVectors Y")
}



export const scaleVector = (v, s) => v.map(n => n * s)
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
