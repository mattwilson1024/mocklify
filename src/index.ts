import { Operator } from './operator';

// export interface IQuery<T> {
//   where?: (item: T) => boolean;
//   omit?: Array<keyof T>,
//   modify?: (itemDraft: Draft<T>, index: number) => void;
//   override?: Partial<T>;
// }

export class Mocklify<T> {
  
  constructor(private data: T[]) {

  }

  public getMany(...operators: Operator<T>[]): T[]|null {
    let results: T[] = [...this.data];
    operators.forEach(operator => {
      results = operator(results);
    });
    return results;
  }
  
}