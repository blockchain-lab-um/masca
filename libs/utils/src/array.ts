export const isIn = <T>(values: readonly T[], value: any): value is T => {
  return values.includes(value);
};
