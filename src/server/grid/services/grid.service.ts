import { AppError } from '@/server/errors/app.error';
import { AppErrorType } from '@/server/types/app-error.types';
import { gridRepository } from '../repositories/grid.repository';
import type { createSupabase } from '@/core/supabase/server';
import {
  ACHIEVEMENT_CATEGORIES,
  CATEGORY_TYPES,
  GRID_SIZE,
  GRID_VALIDATION_ERROR_CODES,
  MAX_GENERATION_ATTEMPTS,
  STAT_CATEGORIES,
} from '@/domains/grid/types/grid.constants';

import type {
  CategoryCounts,
  CategoryType,
  Grid,
  GridCategory,
  GridGenerationConfig,
} from '@/domains/grid/types/grid.types';
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
    throw new AppError(
      'A grid requires exactly six unique categories.',
      'INVALID_GRID_CATEGORIES',
      AppErrorType.INTERNAL_SERVER_ERROR
    );
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
  if (teamResult.error)
    throw new AppError(
      'Unable to load grid teams.',
      'GRID_TEAMS_LOAD_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: teamResult.error }
    );
  if (playerResult.error)
    throw new AppError(
      'Unable to load grid players.',
      'GRID_PLAYERS_LOAD_FAILED',
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: playerResult.error }
    );
  const teams = teamResult.data;
  const players = playerResult.data;
  if (teams.length !== counts.TEAM || players.length !== counts.TEAMMATE) {
    throw new AppError(
      'Not enough teams or eligible players for the selected category counts.',
      'INSUFFICIENT_GRID_CATEGORIES',
      AppErrorType.INTERNAL_SERVER_ERROR
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
): Promise<Grid> {
  try {
    if (!validateGridConfig(config)) {
      throw new AppError(
        'Invalid grid generation config.',
        GRID_VALIDATION_ERROR_CODES.INVALID_CONFIG,
        AppErrorType.VALIDATION
      );
    }
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
      const categoryCounts = selectGridCategoryCounts(config);
      const gridCategories = await loadRandomGridCategories(
        categoryCounts,
        supabase
      );
      const grid = generateGrid(gridCategories);
      if (await isGridSolvable(grid, supabase)) return grid;
    }
    throw new AppError(
      'Unable to generate a solvable grid. Please try again.',
      GRID_VALIDATION_ERROR_CODES.ATTEMPTS_EXHAUSTED,
      AppErrorType.SERVICE_UNAVAILABLE
    );
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      'Failed to generate grid.',
      GRID_VALIDATION_ERROR_CODES.GENERATION_ERROR,
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: error }
    );
  }
}

async function isGridSolvable(
  grid: Grid,
  supabase: ReturnType<typeof createSupabase>
): Promise<boolean> {
  try {
    const { data, error } = await gridRepository.validateGrid(grid, supabase);

    if (error) {
      throw new AppError(
        'Unable to validate grid.',
        GRID_VALIDATION_ERROR_CODES.DATABASE_ERROR,
        AppErrorType.INTERNAL_SERVER_ERROR,
        { cause: error }
      );
    }

    if (!Array.isArray(data) || data.length !== GRID_SIZE ** 2) {
      throw new AppError(
        'Grid validation did not return all nine cells.',
        GRID_VALIDATION_ERROR_CODES.MISSING_CELLS,
        AppErrorType.INTERNAL_SERVER_ERROR
      );
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
        throw new AppError(
          'Grid validation returned an invalid cell.',
          GRID_VALIDATION_ERROR_CODES.INVALID_CELL,
          AppErrorType.INTERNAL_SERVER_ERROR
        );
      }
      positions.add(`${cell.row_index}:${cell.column_index}`);
      if (!cell.has_answer) solvable = false;
    }

    if (positions.size !== GRID_SIZE ** 2) {
      throw new AppError(
        'Grid validation returned duplicate cells.',
        GRID_VALIDATION_ERROR_CODES.DUPLICATE_CELLS,
        AppErrorType.INTERNAL_SERVER_ERROR
      );
    }

    return solvable;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      'Unexpected grid validation failure.',
      GRID_VALIDATION_ERROR_CODES.UNEXPECTED_ERROR,
      AppErrorType.INTERNAL_SERVER_ERROR,
      { cause: error }
    );
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
