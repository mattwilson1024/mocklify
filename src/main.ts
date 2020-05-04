import { DEFAULT_LIMITER } from './limiter';
import { applyOperators, Operator } from './operator';
import { Scope } from './scope';

export class MocklifyDataSet<T> {
  constructor(private filteredMocks: T[]) {}

  public apply(...operators: Array<Scope<T>|Operator<T>>): T[] {
    return applyOperators(this.filteredMocks, operators, DEFAULT_LIMITER);
  }
}

export type AddPredicate<T> = (item: T, index: number, allItems: T[]) => boolean;
export type FilterPredicate<T> = (item: T) => boolean;

export class MocklifyInstance<T> {
  private data: T[] = [];

  constructor() {}

  public add(targetLength: number, items: T[], predicate?: AddPredicate<T>): MocklifyInstance<T> {
    const matchingItems = predicate ? items.filter(predicate) : items;
    const matchingItemCount = matchingItems.length;

    if (matchingItemCount === 0) {
      throw new Error('Cannot add items to mock data set because no items matched the predicate');
    }

    // Start with all items that matched the predicate
    let dataToAdd = matchingItems;

    // Pad it out so that it is at least as long as the target length, repeating if necessary
    if (matchingItemCount < targetLength) {
      const countNeeded = targetLength - matchingItemCount;
      const timesToAdd = Math.ceil(countNeeded / matchingItemCount)

      for(let i = 0; i < timesToAdd; i++) {
        dataToAdd = dataToAdd.concat(matchingItems);
      }
    }

    // Trim down to the target length if there are excess items
    dataToAdd = dataToAdd.slice(0, targetLength)

    // Finally, add all of the new items to the internal state
    this.data = this.data.concat(dataToAdd);

    // Return a chainable instance
    return this;
  }

  public addAll() {

  }

  public generate() {

  }

  public filter() {

  }

  public mutate() {

  }

  public getAll(): T[] {
    return this.data;
  }






  // public getMany(filterPredicate?: FilterPredicate<T>): MocklifyDataSet<T> {
  //   const filteredMocks = filterPredicate ? this.allMocks.filter(mock => filterPredicate(mock)) : this.allMocks;
  //   return new MocklifyDataSet(filteredMocks);
  // }

  // public generate(count: number, factory: () => T): MocklifyDataSet<T> {
  //   if(count <= this.allMocks.length) {
  //     const mocks = produce(this.allMocks, draft => { draft.slice(0, count); });
  //     return new MocklifyDataSet(mocks);
  //   } else {
  //     let generatedMocks = new Array(count - this.allMocks.length).fill(null)
  //     generatedMocks = generatedMocks.map(() => factory());
  //     return new MocklifyDataSet([...this.allMocks, ...generatedMocks]);
  //   }
  // }
}

export function mocklify<T>(): MocklifyInstance<T> {
  return new MocklifyInstance<T>();
}
