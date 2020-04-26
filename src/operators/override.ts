import { produce } from 'immer';

import { Operator } from '../operator';

export function override<T, P extends Partial<T>>(propsToOverride: P): Operator<T> {
  return (items: T[]): T[] => {

    return items.map((item, index) => {
      return produce(item, draft => { Object.assign(draft, propsToOverride) });
    });
    
  }
}
