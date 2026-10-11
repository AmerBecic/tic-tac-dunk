export function parseErrorResponse(body: unknown) {
  if (!body || typeof body !== 'object') {
    return { message: null, error: null };
  }

  return {
    message:
      'message' in body && typeof body.message === 'string'
        ? body.message
        : null,
    error:
      'error' in body && typeof body.error === 'string' ? body.error : null,
  };
}
