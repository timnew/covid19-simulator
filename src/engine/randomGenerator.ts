import sum from 'lodash.sum'
import createDebug from 'debug'

const debug = createDebug('app:randomGenerator')

export function randomFloat(max: number, min: number = 0) {
  return min + Math.random() * (max - min)
}

export function randomInt(max: number, min: number = 0) {
  return Math.floor(randomFloat(min, max))
}

export interface PickAllowance {
  [name: string]: number
}

export function randomPick(allowance: PickAllowance): string {
  const keys = Object.keys(allowance)
  const total = sum(Object.values(allowance))

  let value = randomInt(total)

  debug('allowance: %o', allowance)
  debug('value %s', value)

  for (const key of keys) {
    if (value < allowance[key]) {
      allowance[key] -= 1
      return key
    } else {
      value -= allowance[key]
    }
  }

  throw new Error('Impossible')
}
