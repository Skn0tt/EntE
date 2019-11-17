// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
export function difference<T>(a: Set<T>, b: Set<T>) {
  const result = new Set(a);
  b.forEach(elem => result.delete(elem));
  return result;
}
