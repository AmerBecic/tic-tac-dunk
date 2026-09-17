import type {
  CATEGORY_TYPES,
  GRID_VALIDATION_ERROR_CODES,
} from './GridConstants';

export type CategoryType = (typeof CATEGORY_TYPES)[number];
export type CategoryCounts = Record<CategoryType, number>;
export type GridGenerationConfig = Record<
  CategoryType,
  { min: number; max: number }
>;
export type GridCategory = {
  id: string;
  type: CategoryType;
  label: string;
  includedNames?: string[];
};
export type Grid = {
  rows: GridCategory[];
  columns: GridCategory[];
};

export type GridValidationErrorCode =
  (typeof GRID_VALIDATION_ERROR_CODES)[keyof typeof GRID_VALIDATION_ERROR_CODES];

export type GridValidationError = {
  ok: false;
  code: GridValidationErrorCode;
  message: string;
};

export type GridValidationResult =
  | { ok: true; solvable: boolean }
  | GridValidationError;

export type GridGenerationResult =
  | { ok: true; grid: Grid }
  | GridValidationError;
