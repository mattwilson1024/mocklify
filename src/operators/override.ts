import { produce } from 'immer';

import { Limiter } from '../limiter';
import { Operator } from '../operator';

class OverrideOperator<T, P extends Partial<T>> extends Operator<T> {
  constructor(private propsToOverride: P) {
    super('override');
  }

  action(items: T[], limiter: Limiter<T>): T[] {
    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }
      
      return produce(item, draft => { Object.assign(draft, this.propsToOverride) });
    });
  }
}

export function override<T, P extends Partial<T>>(propsToOverride: P): OverrideOperator<T, P> {
  return new OverrideOperator(propsToOverride);
}
