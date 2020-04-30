import { produce } from 'immer';

import { Limiter } from '../limiter';
import { Operator } from '../operator';

export function override<T, P extends Partial<T>>(propsToOverride: P): Operator<T> {
  return (items: T[], limiter: Limiter<T>): T[] => {

    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }

      return produce(item, draft => { Object.assign(draft, propsToOverride) });
    });

  }
}