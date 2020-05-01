import { produce } from 'immer';

import { Limiter } from '../limiter';
import { Operator, OperatorActionFunction } from '../operator';

class OverrideOperator<T> extends Operator<T> {
  constructor(action: OperatorActionFunction<T>) {
    super('override', action);
  }
}

export function override<T, P extends Partial<T>>(propsToOverride: P): OverrideOperator<T> {
  return new OverrideOperator((items: T[], limiter: Limiter<T>) => {
    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }

      return produce(item, draft => { Object.assign(draft, propsToOverride) });
    });
  });
}
