import {
  isNumber,
  isUndefined
} from './lib.js'

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
