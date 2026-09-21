import { gridRepository } from '../repositories/grid.repository';
import type { createSupabase } from '@/core/supabase/Server';
import {
  ACHIEVEMENT_CATEGORIES,
  CATEGORY_TYPES,
  GRID_SIZE,
  GRID_VALIDATION_ERROR_CODES,
  MAX_GENERATION_ATTEMPTS,
  STAT_CATEGORIES,
} from '@/domains/grid/types/GridConstants';

import type {
  CategoryCounts,
  CategoryType,
  Grid,
  GridCategory,
  GridGenerationConfig,
  GridGenerationResult,
  GridValidationResult,
} from '@/domains/grid/types/GridTypes';
import { randomIndex, shuffle } from '../helpers/grid.helpers';

const [TEAM, TEAMMATE, ACHIEVEMENT, STAT] = CATEGORY_TYPES;

function selectGridCategoryCounts(
  config: GridGenerationConfig,
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
    const laterMin = later.reduce((sum, next) => sum + config[next].min, 0);
    const laterMax = later.reduce((sum, next) => sum + config[next].max, 0);
    const teamSpace = type === TEAM ? 0 : config[TEAM].max - counts[TEAM];
    const min =
      type === TEAM
        ? config[type].min
        : Math.max(config[type].min, remaining - laterMax - teamSpace);
    const max = Math.min(config[type].max, remaining - laterMin);
    counts[type] =
      type === STAT ? max : min + randomIndex(max - min + 1, random);
    remaining -= counts[type];
  }
  counts[TEAM] += remaining;
  return counts;
}

function validateGridConfig(config: GridGenerationConfig): boolean {
  const totalHeadings = GRID_SIZE * 2;
  const limits: Record<CategoryType, number> = {
    TEAM: totalHeadings,
    TEAMMATE: totalHeadings,
    ACHIEVEMENT: ACHIEVEMENT_CATEGORIES.length,
    STAT: STAT_CATEGORIES.length,
  };

  for (const type of CATEGORY_TYPES) {
    const rule = config[type];
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
      return false;
    }

    const { min, max } = rule;
    if (
      !Number.isInteger(min) ||
      !Number.isInteger(max) ||
      min < 0 ||
      max < min ||
      max > limits[type]
    ) {
      return false;
    }
  }

  return true;
}

function generateGrid(
  categories: GridCategory[],
  random: () => number = Math.random
): Grid {
  if (
    categories.length !== GRID_SIZE * 2 ||
    new Set(categories.map((category) => category.id)).size !==
      categories.length
  ) {
    throw new Error('A grid requires exactly six unique categories.');
  }
  const headings = shuffle(categories, random);
  return {
    rows: headings.slice(0, GRID_SIZE),
    columns: headings.slice(GRID_SIZE),
  };
}

async function loadRandomGridCategories(
  counts: CategoryCounts,
  supabase: ReturnType<typeof createSupabase>
): Promise<GridCategory[]> {
  const [teamResult, playerResult] = await Promise.all([
    counts.TEAM > 0
      ? gridRepository.getRandomTeams(counts.TEAM, supabase)
      : Promise.resolve({ data: [], error: null }),
    counts.TEAMMATE > 0
      ? gridRepository.getRandomEligiblePlayers(counts.TEAMMATE, supabase)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (teamResult.error) throw new Error(teamResult.error.message);
  if (playerResult.error) throw new Error(playerResult.error.message);
  const teams = teamResult.data;
  const players = playerResult.data;
  if (teams.length !== counts.TEAM || players.length !== counts.TEAMMATE) {
    throw new Error(
      'Not enough teams or eligible players for the selected category counts.'
    );
  }
  const categories: GridCategory[] = teams.map((team) => ({
    id: `TEAM:${team.code}`,
    referenceId: team.code,
    type: 'TEAM',
    label: team.name,
    includedNames: team.included_names,
  }));
  categories.push(
    ...shuffle(ACHIEVEMENT_CATEGORIES).slice(0, counts.ACHIEVEMENT)
  );
  categories.push(...shuffle(STAT_CATEGORIES).slice(0, counts.STAT));
  for (const player of players) {
    categories.push({
      id: `TEAMMATE:${player.id}`,
      referenceId: player.id,
      type: 'TEAMMATE',
      label: `Teammate of ${player.name}`,
    });
  }
  return categories;
}

async function generateAndValidate(
  config: GridGenerationConfig,
  supabase: ReturnType<typeof createSupabase>
): Promise<GridGenerationResult> {
  try {
    if (!validateGridConfig(config)) {
      return {
        ok: false,
        code: GRID_VALIDATION_ERROR_CODES.INVALID_CONFIG,
        message: 'Invalid grid generation config.',
      };
    }
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
      const categoryCounts = selectGridCategoryCounts(config);
      const gridCategories = await loadRandomGridCategories(
        categoryCounts,
        supabase
      );
      const grid = generateGrid(gridCategories);

      const validation = await isGridSolvable(grid, supabase);
      if (!validation.ok) return validation;
      if (validation.solvable) {
        return { ok: true, grid };
      }
    }
    return {
      ok: false,
      code: GRID_VALIDATION_ERROR_CODES.ATTEMPTS_EXHAUSTED,
      message: 'Unable to generate a solvable grid. Please try again.',
    };
  } catch (error) {
    return {
      ok: false,
      code: GRID_VALIDATION_ERROR_CODES.GENERATION_ERROR,
      message:
        error instanceof Error ? error.message : 'Failed to generate grid.',
    };
  }
}

async function isGridSolvable(
  grid: Grid,
  supabase: ReturnType<typeof createSupabase>
): Promise<GridValidationResult> {
  try {
    const { data, error } = await gridRepository.validateGrid(grid, supabase);

    if (error) {
      return {
        ok: false,
        code: GRID_VALIDATION_ERROR_CODES.DATABASE_ERROR,
        message: error.message,
      };
    }

    if (!Array.isArray(data) || data.length !== GRID_SIZE ** 2) {
      return {
        ok: false,
        code: GRID_VALIDATION_ERROR_CODES.MISSING_CELLS,
        message: 'Grid validation did not return all nine cells.',
      };
    }

    const positions = new Set<string>();
    let solvable = true;
    for (const cell of data) {
      if (
        !cell ||
        !Number.isInteger(cell.row_index) ||
        cell.row_index < 0 ||
        cell.row_index >= GRID_SIZE ||
        !Number.isInteger(cell.column_index) ||
        cell.column_index < 0 ||
        cell.column_index >= GRID_SIZE ||
        typeof cell.has_answer !== 'boolean'
      ) {
        return {
          ok: false,
          code: GRID_VALIDATION_ERROR_CODES.INVALID_CELL,
          message: 'Grid validation returned an invalid cell.',
        };
      }
      positions.add(`${cell.row_index}:${cell.column_index}`);
      if (!cell.has_answer) solvable = false;
    }

    if (positions.size !== GRID_SIZE ** 2) {
      return {
        ok: false,
        code: GRID_VALIDATION_ERROR_CODES.DUPLICATE_CELLS,
        message: 'Grid validation returned duplicate cells.',
      };
    }

    return { ok: true, solvable };
  } catch (error) {
    return {
      ok: false,
      code: GRID_VALIDATION_ERROR_CODES.UNEXPECTED_ERROR,
      message:
        error instanceof Error
          ? error.message
          : 'Unexpected grid validation failure.',
    };
  }
}

export const gridService = {
  selectGridCategoryCounts,
  generateGrid,
  isGridSolvable,
  generateAndValidate,
  loadRandomGridCategories,
  validateGridConfig,
};
