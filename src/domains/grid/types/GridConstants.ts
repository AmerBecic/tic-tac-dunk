import { GridCategory, GridGenerationConfig } from '..';

export const GRID_SIZE = 3;

export const DAILY_GRID_CONFIG: GridGenerationConfig = {
  TEAM: { min: 3, max: 5 },
  TEAMMATE: { min: 1, max: 3 },
  ACHIEVEMENT: { min: 0, max: 2 },
  STAT: { min: 0, max: 1 },
};

export const MAX_GENERATION_ATTEMPTS = 25;

export const CATEGORY_TYPES = [
  'TEAM',
  'TEAMMATE',
  'ACHIEVEMENT',
  'STAT',
] as const;

export const GRID_VALIDATION_ERROR_CODES = {
  DATABASE_ERROR: 'DATABASE_ERROR',
  MISSING_CELLS: 'MISSING_CELLS',
  INVALID_CELL: 'INVALID_CELL',
  DUPLICATE_CELLS: 'DUPLICATE_CELLS',
  UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
  INVALID_CONFIG: 'INVALID_CONFIG',
  ATTEMPTS_EXHAUSTED: 'ATTEMPTS_EXHAUSTED',
  GENERATION_ERROR: 'GENERATION_ERROR',
} as const;

export const ACHIEVEMENT_CATEGORIES: GridCategory[] = [
  { id: 'ACHIEVEMENT:mvp-or-dpoy', type: 'ACHIEVEMENT', label: 'MVP or DPOY' },
  { id: 'ACHIEVEMENT:roy-or-mip', type: 'ACHIEVEMENT', label: 'ROY or MIP' },
];

export const STAT_CATEGORIES: GridCategory[] = [
  {
    id: 'STAT:season-points:gte:2000',
    type: 'STAT',
    label: '2,000+ points in a season',
  },
];
