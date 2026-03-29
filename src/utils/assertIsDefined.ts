type AssertIsDefined = <T>(val: T) => asserts val is NonNullable<T>;
export const assertIsDefined: AssertIsDefined = <T>(
  val: T
): asserts val is NonNullable<T> => {
  if (val === undefined || val === null)
    throw `Expected 'val' to be defined, but received ${val}`; // using AssertionError fails to build with: "Error: 'AssertionError' is not exported by __vite-browser-external"
};
