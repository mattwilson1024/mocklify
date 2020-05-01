import { Draft, produce } from 'immer';

import { Limiter } from '../limiter';
import { Operator } from '../operator';

type ModifierFunction<T> = (itemDraft: Draft<T>, index: number) => void;

class ModifyOperator<T> extends Operator<T> {
  constructor(private modifierFunction: ModifierFunction<T>) {
    super('modify');
  }

  action(items: T[], limiter: Limiter<T>): T[] {
    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }
      
      return produce(item, draft => { this.modifierFunction(draft, index) });
    });
  }
}

export function modify<T>(modifierFunction: ModifierFunction<T>): ModifyOperator<T> {
  return new ModifyOperator(modifierFunction);
}