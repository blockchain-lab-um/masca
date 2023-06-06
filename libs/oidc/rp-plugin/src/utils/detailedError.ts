export class DetailedError extends Error {
  error: string;

  // HTTP status code (default: 400)
  statusCode: number;

  errorDescription: string;

  constructor(error: string, errorDescription: string, statusCode?: number) {
    super(errorDescription);
    this.name = 'DetailedError';
    this.error = error;
    this.errorDescription = errorDescription;
    this.statusCode = statusCode ?? 400;
  }

  toString(): string {
    return `${this.name}: [${this.error} - ${this.errorDescription}]`;
  }

  toJSON() {
    return {
      error: this.error,
      ...(this.errorDescription && {
        error_description: this.errorDescription,
      }),
    };
  }
}

export default DetailedError;
