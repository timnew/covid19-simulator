import Chance from 'chance'

const chance = new Chance()

type AtLeastOneKey<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U]

interface MinMaxRange {
  min: number
  max: number
}

interface NormalRangeMeanOnly {
  mean: number
}

interface NormalRange extends NormalRangeMeanOnly {
  dev: number
}

export type RandomVariable =
  | number
  | AtLeastOneKey<MinMaxRange>
  | NormalRange
  | NormalRangeMeanOnly

function isMinMaxRange(options: RandomVariable): options is MinMaxRange {
  const range = options as MinMaxRange
  return range.max !== undefined || range.min !== undefined
}

function isNormalRange(
  options: RandomVariable
): options is NormalRangeMeanOnly {
  return (options as NormalRangeMeanOnly).mean !== undefined
}

export function randomFloat(options: RandomVariable): number {
  if (isMinMaxRange(options)) {
    return chance.floating(options)
  }

  if (isNormalRange(options)) {
    return chance.normal(options)
  }

  return options as number
}

export function randomInt(options: RandomVariable): number {
  if (isMinMaxRange(options)) {
    return chance.integer(options)
  }

  if (isNormalRange(options)) {
    return Math.round(chance.normal(options))
  }

  return Math.round(options as number)
}

export function randomBoolean(likelihood: number): boolean {
  if (0 < likelihood && likelihood < 1) {
    return chance.bool({ likelihood: likelihood * 100 })
  } else {
    return chance.bool({ likelihood: likelihood })
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

export function randomName(): string {
  return chance.first()
}

export function randomAngle(): number {
  return chance.floating({min: 0 , max: Math.PI*2})
}