export const AppErrorType = {
  VALIDATION: 'validation',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not-found',
  CONFLICT: 'conflict',
  INTERNAL_SERVER_ERROR: 'internal',
} as const;

export type AppErrorType = (typeof AppErrorType)[keyof typeof AppErrorType];
