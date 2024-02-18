export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function nonNullable<T>(value: T | null | undefined): T {
  if (value == null) {
    throw new Error("nonNullable");
  }
  return value;
}
