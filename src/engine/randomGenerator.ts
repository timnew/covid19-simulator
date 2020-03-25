import createDebug from 'debug'
import Chance from 'chance'

const debug = createDebug('app:randomGenerator')
const chance = new Chance()

export function randomFloat(max: number, min: number = 0) {
  return chance.floating({ min: min, max: max })
}

export function randomInt(max: number, min: number = 0) {
  return chance.integer({ min: min, max: max })
}

export function randomBoolean(trueRate: number): boolean {
  if (0 < trueRate && trueRate < 1) {
    return chance.bool({ likelihood: trueRate * 100 })
  } else {
    return chance.bool({ likelihood: trueRate })
  }
}

export interface PickAllowance {
  [name: string]: number
}

export function randomPick(allowance: PickAllowance): string {
  const keys = Object.keys(allowance)
  const weights = Object.values(allowance)

  const picked = chance.weighted(keys, weights)

  allowance[picked] -= 1

  return picked
}
