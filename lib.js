const { abs } = Math

export const isUndefined = x => typeof x === 'undefined'

{
  console.assert( isUndefined([ ][0]), 'isUndefined true')
  console.assert(!isUndefined([1][0]), 'isUndefined false')
}


export const isNumber = x => typeof x === 'number' && !Number.isNaN(x) && Number.isFinite(x)

{
  console.assert( isNumber(1), 'isNumber true')
  console.assert( !isNumber(1/0), 'isNumber for Infitiy: false')
  console.assert( !isNumber(0/0), 'isNumber for NaN: false')
}


export const isFunction = x => typeof x === 'function'

{
  console.assert( isFunction(() => {}), 'isFunction true')
  console.assert( !isFunction(1), 'isFunction false')
}


const prime1 = 723098510647
const prime2 = 402857209921
const prime3 = 104759842669
const prime4 = 912784895021

export const random1 = (a, bound) => abs(((prime1 * a + prime3) ^ prime4) % bound)
export const random2 = (a, b, bound) => abs(((prime1 * a + prime2 * b + prime3) ^ prime4) % bound)
