import { GRID_SIZE } from '@/core/constants/grid';
import {
  ACHIEVEMENT_CATEGORIES,
  STAT_CATEGORIES,
} from './category-definitions';
import {
  CATEGORY_TYPES,
  type CategoryType,
  type GridGenerationConfig,
} from './types';

export class GridConfigurationError extends Error {}
export type CategoryBounds = Record<CategoryType, { min: number; max: number }>;

export function validateGridConfig(
  config: GridGenerationConfig
): CategoryBounds {
  const total = GRID_SIZE * 2;
  const limits: Record<CategoryType, number> = {
    TEAM: total,
    TEAMMATE: total,
    ACHIEVEMENT: ACHIEVEMENT_CATEGORIES.length,
    STAT: STAT_CATEGORIES.length,
  };
  const bounds: CategoryBounds = {
    TEAM: { min: 0, max: 0 },
    TEAMMATE: { min: 0, max: 0 },
    ACHIEVEMENT: { min: 0, max: 0 },
    STAT: { min: 0, max: 0 },
  };
  for (const type of CATEGORY_TYPES) {
    const rule = config.categoryRules[type];
    if (rule === undefined) continue;
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
      throw new GridConfigurationError(
        `${type} must have a min/max rule object.`
      );
    }
    const min = rule.min === undefined ? 0 : rule.min;
    const max = rule.max === undefined ? limits[type] : rule.max;
    if (
      !Number.isInteger(min) ||
      !Number.isInteger(max) ||
      min < 0 ||
      max < min ||
      max > limits[type]
    ) {
      throw new GridConfigurationError(
        `${type} requires integer limits: 0 <= min <= max <= ${limits[type]}.`
      );
    }
    bounds[type] = { min, max };
  }
  const minimumTotal = CATEGORY_TYPES.reduce(
    (sum, type) => sum + bounds[type].min,
    0
  );
  const maximumTotal = CATEGORY_TYPES.reduce(
    (sum, type) => sum + bounds[type].max,
    0
  );
  if (minimumTotal > total || maximumTotal < total) {
    throw new GridConfigurationError(
      `Category rules must allow exactly ${total} headings (minimum total: ${minimumTotal}, maximum total: ${maximumTotal}).`
    );
  }
  return bounds;
}
