import type { ApiResponse } from '@/core/types/api.types';
import type { Grid, GridValidationErrorCode } from './grid.types';

export type GenerateGridResponse = ApiResponse<Grid> & {
  code?: GridValidationErrorCode;
};
