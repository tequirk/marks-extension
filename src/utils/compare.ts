import { Bookmark } from "../types";

type SortableProperty<T> = keyof {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

const { compare } = new Intl.Collator();

// TS can't infer that T[prop] will be of type string
const AssertType = <T>(type: unknown) => type as T;

export const byProperty =
  <T>(prop: SortableProperty<T>, reverse?: boolean) =>
  (a: T, b: T) =>
    compare(AssertType<string>(a[prop]), AssertType<string>(b[prop])) *
    (reverse ? -1 : 1);

export const byLastUsed = (a: Bookmark, b: Bookmark) => {
  if (!a.lastUsed) return 1;
  if (!b.lastUsed) return -1;
  return b.lastUsed.getTime() - a.lastUsed.getTime();
};

