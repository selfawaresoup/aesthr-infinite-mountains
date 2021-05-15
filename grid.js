import {vectorLength, addVectors, subtractVectors} from './vector.js';

const {pow, floor} = Math

const gridSize = 10



const cellOnPosition = vec => vec.map(x => {
  const a = x < 0 ? -1 : 1
  const b = x < 0 ? gridSize : 0
  const xp = x * a
  return a * (xp - xp % gridSize + b)
})

{
  const t1 = cellOnPosition([5, 5])
  console.assert(t1[0] === 0, 'cellOnPosition [5, 5]')
  console.assert(t1[1] === 0, 'cellOnPosition [5, 5]')

  const t2 = cellOnPosition([21, -17])
  console.assert(t2[0] === 20, 'cellOnPosition [21, -17]')
  console.assert(t2[1] === -20, 'cellOnPosition [21, -17]')
}



// export const circleCells = (vec, r) => {
//   const center = cellOnPosition(vec)
//   const gr = r - (r % gridSize) + gridSize

//   const cells = []
//   for (let y = -gr; y <= gr; y += gridSize) {
//     for (let x = -gr; x <= gr; x += gridSize) {
//       const localVec = [x, y]
//       if (vectorLength(localVec) < r) {
//         cells.push(addVectors(localVec, center))
//       }
//     }
//   }

//   return cells
// }

// {
//   const c = circleCells([0,0], 20)
//   //console.assert(c.length === 25, 'circleCells')
// }



const isCellInCircle = (center, r) => c => vectorLength(subtractVectors(c, center)) <= r
const isCellNotInCircle = (center, r) => c => vectorLength(subtractVectors(c, center)) > r

export const cellsInCircle = (cells, center, r) => cells.filter(isCellInCircle(center, r))
export const cellsNotInCircle = (cells, center, r) => cells.filter(isCellNotInCircle(center, r))

{
   console.assert(isCellInCircle([0,0], 100)([90,0]), 'isCellInCircle')
   console.assert(!isCellInCircle([0,0], 100)([110,0]), 'isCellInCircle')
   const t1 = cellsInCircle([[0,0], [90,0], [110, 0]], [0,0], 100)
   console.assert(t1.length === 2)
}

export const circleCells = (vec, r) => {
  const [cx, cy] = cellOnPosition(vec)
  const gr = floor(r / gridSize) + 1
  const n = 2 * gr + 1 

  return Array.from({length: pow(n, 2)}).map((c, i) => {
    const y = i % n
    const x = (i - y) /n
    return [(x - gr) * gridSize + cx, (y - gr) * gridSize + cy]
  }).filter(isCellInCircle(vec, r))
}

circleCells([0,0], 100)