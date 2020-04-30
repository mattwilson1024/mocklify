export type Operator<T> = (items: T[]) => T[];

export function applyOperators<T>(items: T[], ...operators: Operator<T>[]): T[] {
  let results: T[] = [...items];
  operators.forEach(operator => {
    results = operator(results);
  });
  return results;
}