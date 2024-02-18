import { ObjectId } from "mongodb";
import { ZodType } from "zod";

export function parseDocs<T>(schema: ZodType<T>) {
  return (array: unknown[]) =>
    array.flatMap((item) => {
      try {
        return [schema.parse(item)];
      } catch {
        return [];
      }
    });
}

export function compareObjectId(a: ObjectId, b: ObjectId) {
  for (let i = 0; i < 12; i++) {
    if (a.id[i] !== b.id[i]) {
      return a.id[i] - b.id[i];
    }
  }
  return 0;
}

export function notNullish<T>(value: T | null | undefined): value is T {
  return value != null;
}

export function last<T>(array?: T[]): T | undefined {
  return array ? array[array.length - 1] : undefined;
}
