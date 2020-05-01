import { produce } from 'immer';

import { Limiter } from '../limiter';
import { Operator } from '../operator';

class OmitOperator<T> extends Operator<T> {
  constructor(private propsToOmit: Array<keyof T>) {
    super('omit');
  }

  action(items: T[], limiter: Limiter<T>): T[] {
    return items.map((item, index) => {
      if (!limiter(item, index)) { return item; }
      
      return produce(item, draft => { this.deletePropsFromObject(draft, this.propsToOmit); });
    });
  }

  private deletePropsFromObject(item: any, propsToDelete: any[]) {
    propsToDelete.forEach((propToOmit: string) => {
      delete item[propToOmit]
    });
  }
}

export function omit<T>(propsToOmit: Array<keyof T>): OmitOperator<T> {
  return new OmitOperator(propsToOmit);
}