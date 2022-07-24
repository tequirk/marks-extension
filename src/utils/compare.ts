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

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;
  describe("byProperty", () => {
    it("returns a positive number if the second parameter comes before the first", () => {
      const sorted = byProperty<{ name: string }>("name")(
        { name: "John" },
        { name: "Jane" }
      );
      expect(sorted).toEqual(1);
    });
    it("returns a negative number if the first parameter comes before the second", () => {
      const sorted = byProperty<{ name: string }>("name")(
        { name: "Jane" },
        { name: "John" }
      );
      expect(sorted).toEqual(-1);
    });
    it("returns 0 if the parameters are the same", () => {
      const sorted = byProperty<{ name: string }>("name")(
        { name: "Jane" },
        { name: "Jane" }
      );
      expect(sorted).toEqual(0);
    });
    it("returns a negative number if the second parameter comes before the first and is in reverse", () => {
      const sorted = byProperty<{ name: string }>("name", true)(
        { name: "John" },
        { name: "Jane" }
      );
      expect(sorted).toEqual(-1);
    });
    it("returns a positive number if the first parameter comes before the second and is in reverse", () => {
      const sorted = byProperty<{ name: string }>("name", true)(
        { name: "Jane" },
        { name: "John" }
      );
      expect(sorted).toEqual(1);
    });
    it("works with sort", () => {
      type Person = { name: string };
      const people: Person[] = [{ name: "John" }, { name: "Jane" }];
      const sorted = people.sort(byProperty<Person>("name"));
      expect(sorted).toEqual([{ name: "Jane" }, { name: "John" }]);
    });
    it("works with sort in reverse", () => {
      type Person = { name: string };
      const people: Person[] = [{ name: "Jane" }, { name: "John" }];
      const sorted = people.sort(byProperty<Person>("name", true));
      expect(sorted).toEqual([{ name: "John" }, { name: "Jane" }]);
    });
  });
  describe("byLastUsed", () => {
    it("returns a positive number if the second parameter comes before the first", () => {
      const sorted = byLastUsed(
        {
          id: "1",
          isFavorite: false,
          lastUsed: new Date(0),
          tags: [],
          title: "A",
          url: "https://example.com",
        },
        {
          id: "2",
          isFavorite: false,
          lastUsed: new Date(1),
          tags: [],
          title: "A",
          url: "https://example.com",
        }
      );
      expect(sorted).toEqual(1);
    });
  });
}
