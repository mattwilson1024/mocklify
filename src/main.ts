import { DEFAULT_LIMITER } from './limiter';
import { applyOperators, Operator } from './operator';
import { Scope } from './scope';

export type FilterPredicate<T> = (item: T, index: number, allItems: T[]) => boolean;

export type MockFactory<T> = (index: number) => T;
export type PartialMockFactory<T> = (index: number) => Partial<T>;

export class MocklifyInstance<T> {
  private data: T[] = [];

  constructor() {}

  public add(targetLength: number, items: T[], predicate?: FilterPredicate<T>): MocklifyInstance<T> {
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

  public addAll(items: T[], predicate?: FilterPredicate<T>): MocklifyInstance<T> {
    const matchingItems = predicate ? items.filter(predicate) : items;
    this.data = this.data.concat(matchingItems);
    return this;
  }

  public generate(count: number, factory: MockFactory<T>): MocklifyInstance<T> {
    let newItems: T[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push(factory(i));
    }
    this.data = this.data.concat(newItems);

    return this;
  }

  public generatePartial(count: number, factory: PartialMockFactory<T>): MocklifyInstance<T> {
    let newItems: T[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push(factory(i) as T);
    }
    this.data = this.data.concat(newItems);

    return this;
  }

  public filter(predicate: FilterPredicate<T>): MocklifyInstance<T> {
    this.data = this.data.filter(predicate);
    return this;
  }

  public transform(...operators: Array<Scope<T>|Operator<T>>): MocklifyInstance<T> {
    this.data = applyOperators(this.data, operators, DEFAULT_LIMITER);
    return this;
  }

  public get(count: number): T[] {
    return count > 0 ? this.data.slice(0, count) : [];
  }

  public getSlice(start: number, end?: number): T[] {
    return this.data.slice(start, end);
  }

  public getAll(): T[] {
    return this.data;
  }

  public getFirst(): T | undefined {
    return this.data[0];
  }

  public getLast(): T | undefined {
    const [lastItem] = this.data.slice(-1)
    return lastItem;
  }

  public getOne(predicate: FilterPredicate<T>): T | undefined {
    return this.data.find(predicate);
  }

  public getWhere(predicate: FilterPredicate<T>): T[] {
    return this.data.filter(predicate);
  }

  public getRandom(count: number): T[] {
    let results: T[] = [];
    let availableItems = [...this.data];
    for (let i = 0; i < count && availableItems.length > 0; i++) {
      const randomIndex = this.getRandomIntBetween(0, availableItems.length - 1);
      const [randomItem] = availableItems.splice(randomIndex, 1);
      results.push(randomItem);
    }
    return results;
  }

  public getRandomOne(): T | undefined {
    return this.getRandom(1)?.[0];
  }

  public getShuffled(): T[] {
    return this.getRandom(this.data.length);
  }

  private getRandomIntBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export function mocklify<T>(): MocklifyInstance<T> {
  return new MocklifyInstance<T>();
}
