import { GRID_SIZE } from '@/core/constants/grid';
import {
  CATEGORY_TYPES,
  type CategoryType,
  type GridCategory,
  type GeneratedGrid,
} from './types';

import { GridConfigurationError, type CategoryBounds } from './validate-config';
export type CategoryCounts = Record<CategoryType, number>;

const [TEAM, TEAMMATE, ACHIEVEMENT, STAT] = CATEGORY_TYPES;

function randomIndex(length: number, random: () => number): number {
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new GridConfigurationError(
      'Random function must return a number in [0, 1).'
    );
  }
  return Math.floor(value * length);
}

export function shuffle<T>(
  values: readonly T[],
  random: () => number = Math.random
): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1, random);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function selectCategoryCounts(
  bounds: CategoryBounds,
  random: () => number = Math.random
): CategoryCounts {
  const total = GRID_SIZE * 2;
  const order = CATEGORY_TYPES;
  const counts: CategoryCounts = {
    [TEAM]: 0,
    [TEAMMATE]: 0,
    [ACHIEVEMENT]: 0,
    [STAT]: 0,
  };
  let remaining = total;
  for (let index = 0; index < order.length; index++) {
    const type = order[index];
    const later = order.slice(index + 1);
    const laterMin = later.reduce((sum, next) => sum + bounds[next].min, 0);
    const laterMax = later.reduce((sum, next) => sum + bounds[next].max, 0);
    const teamSpace = type === TEAM ? 0 : bounds[TEAM].max - counts[TEAM];
    const min =
      type === TEAM
        ? bounds[type].min
        : Math.max(bounds[type].min, remaining - laterMax - teamSpace);
    const max = Math.min(bounds[type].max, remaining - laterMin);
    counts[type] =
      type === STAT ? max : min + randomIndex(max - min + 1, random);
    remaining -= counts[type];
  }
  counts[TEAM] += remaining;
  return counts;
}

export function generateGrid(
  categories: GridCategory[],
  random: () => number = Math.random
): GeneratedGrid {
  if (
    categories.length !== GRID_SIZE * 2 ||
    new Set(categories.map((category) => category.id)).size !==
      categories.length
  ) {
    throw new GridConfigurationError(
      'A grid requires exactly six unique categories.'
    );
  }
  const headings = shuffle(categories, random);
  return {
    rows: headings.slice(0, GRID_SIZE),
    columns: headings.slice(GRID_SIZE),
  };
}
