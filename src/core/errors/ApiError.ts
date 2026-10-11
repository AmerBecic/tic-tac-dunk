export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body: unknown = null,
    public readonly code: string | null = null
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
