import type { ApiResponse } from '@/domains/Types';
import type { Grid, GridValidationErrorCode } from './GridTypes';

export type GenerateGridResponse = ApiResponse<Grid> & {
  code?: GridValidationErrorCode;
};
