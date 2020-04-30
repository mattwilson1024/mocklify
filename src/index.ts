import { applyOperators, Operator } from './operator';

export class MocklifyDataSet<T> {
  constructor(private filteredMocks: T[]) {}

  public apply(...operators: Operator<T>[]): T[] {
    return applyOperators(this.filteredMocks, ...operators);
  }
}

type FilterPredicate<T> = (item: T) => boolean;

export class MocklifyInstance<T> {
  constructor(private allMocks: T[]) {}

  public getMany(filterPredicate?: FilterPredicate<T>): MocklifyDataSet<T> {
    const filteredMocks = filterPredicate ? this.allMocks.filter(mock => filterPredicate(mock)) : this.allMocks;
    return new MocklifyDataSet(filteredMocks);
  }
}

export function mocklify<T>(allMocks: T[]): MocklifyInstance<T> {
  return new MocklifyInstance(allMocks);
}