import type { ApiResponse } from '@/core/types/api.types';
import type { Grid, GridValidationErrorCode } from './GridTypes';

export type GenerateGridResponse = ApiResponse<Grid> & {
  code?: GridValidationErrorCode;
};
