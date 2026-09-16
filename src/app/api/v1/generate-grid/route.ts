import { validateGridConfig } from '@/domains/grid/validate-config';
import { NextResponse } from 'next/server';

import { createSupabase } from '@/core/supabase/server';
import { loadRandomCategories } from '@/domains/grid/categories.server';
import { DAILY_GRID_CONFIG } from '@/domains/grid/config';
import { generateGrid, selectCategoryCounts } from '@/domains/grid/generator';
import { isGridSolvable } from '@/domains/grid/validate-grid.server';

const MAX_GENERATION_ATTEMPTS = 25;

export async function GET() {
  try {
    const bounds = validateGridConfig(DAILY_GRID_CONFIG);
    const supabase = createSupabase();

    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
      const counts = selectCategoryCounts(bounds);
      const categories = await loadRandomCategories(counts);
      const grid = generateGrid(categories);

      if (await isGridSolvable(grid, supabase)) {
        return NextResponse.json(
          { data: grid },
          { headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }

    return NextResponse.json(
      {
        error: `Unable to find a solvable grid after ${MAX_GENERATION_ATTEMPTS} attempts. Please try again.`,
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Failed to generate grid:', error);

    return NextResponse.json(
      { error: 'Failed to generate grid' },
      { status: 500 }
    );
  }
}
