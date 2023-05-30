// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isIn = <T>(values: readonly T[], value: any): value is T => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return values.includes(value);
};
