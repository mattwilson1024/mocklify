// import { Draft, produce } from 'immer';
import { Draft, produce } from 'immer';

import { Limiter } from '../limiter';
import { Operator, OperatorActionFunction } from '../operator';

class ModifyOperator<T> extends Operator<T> {
  constructor(action: OperatorActionFunction<T>) {
    super('modify', action);
  }
}

type ModifierFunction<T> = (itemDraft: Draft<T>, index: number) => void;

export function modify<T>(modifierFunction: ModifierFunction<T>): ModifyOperator<T> {
  return new ModifyOperator((items: T[], limiter: Limiter<T>) => {
    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }
      
      return produce(item, draft => { modifierFunction(draft, index) });
    });
  });
}
