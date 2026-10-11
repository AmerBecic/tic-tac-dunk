import type { ApiResponse } from '@/server/types/api.types';
import type { Grid, GridValidationErrorCode } from './grid.types';

export type GenerateGridResponse = ApiResponse<Grid> & {
  code?: GridValidationErrorCode;
};
