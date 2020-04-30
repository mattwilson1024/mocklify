import { produce } from 'immer';

import { DEFAULT_LIMITER, Limiter } from '../limiter';
import { Operator } from '../operator';

export function override<T, P extends Partial<T>>(propsToOverride: P, limiter: Limiter<T> = DEFAULT_LIMITER): Operator<T> {
  return (items: T[]): T[] => {

    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }

      return produce(item, draft => { Object.assign(draft, propsToOverride) });
    });

  }
}