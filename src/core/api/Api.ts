import { parseErrorResponse } from '@/core/helpers/ParseErrorResponse';
import { ApiError } from '@/core/errors/ApiError';

export { ApiError } from '@/core/errors/ApiError';

const call = async <T>(
  apiPath: string,
  method: string,
  cache: RequestCache = 'default',
  payload: unknown = null,
  headers: Record<string, string> = {}
): Promise<T> => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: payload !== null ? JSON.stringify(payload) : null,
    cache,
  };
  const response = await fetch(`/api/${apiPath}`, config);

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const errorResponse = parseErrorResponse(body);
    const message =
      errorResponse.message ??
      `API error: ${response.status} ${response.statusText}`;
    const code = errorResponse.error;

    const error = new ApiError(response.status, message, body, code);
    if (process.env.NODE_ENV === 'development') {
      console.error('[Api] request failed', {
        method,
        path: `/api/${apiPath}`,
        status: response.status,
        code,
        message,
      });
    }
    throw error;
  }

  return await response.json();
};

const get = async <T>(
  apiPath: string,
  cache: RequestCache = 'default',
  headers: Record<string, string> = {}
): Promise<T> => call<T>(apiPath, 'GET', cache, null, headers);

const post = async <T>(
  apiPath: string,
  payload: unknown = null,
  cache: RequestCache = 'default',
  headers: Record<string, string> = {}
): Promise<T> => call<T>(apiPath, 'POST', cache, payload, headers);

const put = async <T>(
  apiPath: string,
  payload: unknown,
  cache: RequestCache = 'default'
): Promise<T> => call<T>(apiPath, 'PUT', cache, payload);

const del = async <T>(
  apiPath: string,
  payload: unknown = null,
  cache: RequestCache = 'default'
): Promise<T> => call<T>(apiPath, 'DELETE', cache, payload);

export const Api = {
  get,
  post,
  put,
  delete: del,
};
