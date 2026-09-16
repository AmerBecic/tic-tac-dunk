import 'server-only';

import { GRID_SIZE } from '@/core/constants/grid';
import { createSupabase } from '@/core/supabase/server';

import type { GeneratedGrid } from './types';

export async function isGridSolvable(
  grid: GeneratedGrid,
  supabase: ReturnType<typeof createSupabase>
): Promise<boolean> {
  const { data, error } = await supabase.rpc('validate_grid', {
    _rows: grid.rows,
    _columns: grid.columns,
  });

  if (error) throw new Error(`Grid validation failed: ${error.message}`);

  if (!Array.isArray(data) || data.length !== GRID_SIZE ** 2) {
    throw new Error('Grid validation did not return all nine cells.');
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
      throw new Error('Grid validation returned an invalid cell.');
    }
    positions.add(`${cell.row_index}:${cell.column_index}`);
    if (!cell.has_answer) solvable = false;
  }

  if (positions.size !== GRID_SIZE ** 2) {
    throw new Error('Grid validation returned duplicate cells.');
  }

  return solvable;
}
