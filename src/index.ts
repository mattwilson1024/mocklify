import { Operator } from './operator';

export class MocklifyInstance<T> {
  
  constructor(private data: T[]) {}

  public getMany(...operators: Operator<T>[]): T[]|null {
    let results: T[] = [...this.data];
    operators.forEach(operator => {
      results = operator(results);
    });
    return results;
  }
  
}

export function mocklify<T>(dataSet: T[]): MocklifyInstance<T> {
  return new MocklifyInstance(dataSet);
}