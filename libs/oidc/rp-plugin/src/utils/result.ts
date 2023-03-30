import DetailedError from './detailedError.js';

export type Result<T> = {
  success: boolean;
} & (
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: DetailedError;
    }
);

export const isError = <T>(
  result: Result<T>
): result is {
  success: false;
  error: DetailedError;
} => !result.success;
