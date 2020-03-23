import SimulationParameters from './SimulationParameters'
import Person from './Person'
import { randomFloat } from '../engine/randomGenerator'
import Vector2D from './Vector2D'

export default function* generatePopulation(
  parameters: SimulationParameters
): Generator<Person, void, unknown> {
  for (let index = 0; index < parameters.population; index++) {
    yield generatePerson(`P${index}`, parameters)
  }
}

// TODO: Need a better implementation to layout persons in more even way
export function generatePerson(
  name: string,
  parameters: SimulationParameters
): Person {
  return new Person(
    name,
    parameters.personRadius,
    new Vector2D(
      randomFloat(
        parameters.screenWidth - parameters.personRadius,
        parameters.personRadius
      ),
      randomFloat(
        parameters.screenHeight - parameters.personRadius,
        parameters.personRadius
      )
    ),
    Vector2D.fromPolarCoordinate(
      randomFloat(parameters.maxInitialSpeed),
      randomFloat(Math.PI * 2)
    )
  )
}
