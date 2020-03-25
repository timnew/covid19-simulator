import Person from './Person'

export default class Population {
  private _persons: Person[] = []

  clear() {
    this._persons = []
  }

  add(person: Person) {
    this._persons.push(person)
  }

  get all(): Person[] {
    return this._persons
  }

  get size(): number {
    return this._persons.length
  }

  get(index: number): Person {
    return this._persons[index]
  }

  findHitEnabled(): Array<Person> {
    return this.all.filter((p)=> p.state.isHitEnabled)
  }
}
