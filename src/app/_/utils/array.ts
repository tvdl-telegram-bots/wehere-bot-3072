export function zip<A, B>(a: A[], b: B[]): [A, B][] {
  return Array.from(
    Array(Math.min(a.length, b.length)), //
    (_, i) => [a[i], b[i]]
  );
}
