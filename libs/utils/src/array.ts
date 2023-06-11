export const isIn = <T>(values: readonly T[], value: any): value is T =>
  values.includes(value);
