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
