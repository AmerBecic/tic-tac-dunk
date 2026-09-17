export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
};
