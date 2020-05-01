// import produce from 'immer';
import { produce } from 'immer';

import { Limiter } from '../limiter';
import { Operator, OperatorActionFunction } from '../operator';

class OmitOperator<T> extends Operator<T> {
  constructor(action: OperatorActionFunction<T>) {
    super('omit', action);
  }
}

export function omit<T>(propsToOmit: Array<keyof T>): OmitOperator<T> {
  return new OmitOperator((items: T[], limiter: Limiter<T>) => {
    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }

      return produce(item, draft => { deletePropsFromObject(draft, propsToOmit); });
    });
  });
}

function deletePropsFromObject(item: any, propsToDelete: any[]) {
  propsToDelete.forEach((propToOmit: string) => {
    delete item[propToOmit]
  });
}