import { AppErrorType } from '@/server/types/app-error.types';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly kind: AppErrorType = AppErrorType.INTERNAL_SERVER_ERROR,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = 'AppError';
  }
}
