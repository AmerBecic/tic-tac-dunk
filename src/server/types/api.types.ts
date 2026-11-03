export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  paging_counter?: number;
  has_prev_page?: boolean;
  has_next_page?: boolean;
  prev_page?: number | null;
  next_page?: number | null;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  pagination?: Pagination;
};
