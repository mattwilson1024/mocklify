import { DEFAULT_LIMITER } from './limiter';
import { applyOperators, Operator } from './operator';
import { Scope } from './scope';
import { produce } from "immer";

export class MocklifyDataSet<T> {
  constructor(private filteredMocks: T[]) {}

  public apply(...operators: Array<Scope<T>|Operator<T>>): T[] {
    return applyOperators(this.filteredMocks, operators, DEFAULT_LIMITER);
  }
}

type FilterPredicate<T> = (item: T) => boolean;

export class MocklifyInstance<T> {
  constructor(private allMocks: T[]) {}

  public getMany(filterPredicate?: FilterPredicate<T>): MocklifyDataSet<T> {
    const filteredMocks = filterPredicate ? this.allMocks.filter(mock => filterPredicate(mock)) : this.allMocks;
    return new MocklifyDataSet(filteredMocks);
  }

  public generate(count: number, factory: () => T): MocklifyDataSet<T> {
    if(count <= this.allMocks.length) {
      const mocks = produce(this.allMocks, draft => { draft.slice(0, count); });
      return new MocklifyDataSet(mocks);
    } else {
      let generatedMocks = new Array(count - this.allMocks.length).fill(null)
      generatedMocks = generatedMocks.map(() => factory());
      return new MocklifyDataSet([...this.allMocks, ...generatedMocks]);
    }
  }
}

export function mocklify<T>(allMocks: T[]): MocklifyInstance<T> {
  return new MocklifyInstance(allMocks);
}
