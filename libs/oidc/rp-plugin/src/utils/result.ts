export type Result<T> = {
  success: boolean;
} & (
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: Error;
    }
);

export const isError = <T>(
  result: Result<T>
): result is { success: false; error: Error } => !result.success;
