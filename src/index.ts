import { applyOperators, Operator } from './operator';

export class MocklifyInstance<T> {
  
  constructor(private data: T[]) {}

  public getMany(...operators: Operator<T>[]): T[] {
    return applyOperators(this.data, ...operators);
  }
  
}

export function mocklify<T>(dataSet: T[]): MocklifyInstance<T> {
  return new MocklifyInstance(dataSet);
}