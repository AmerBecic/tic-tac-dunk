import { validateGridConfig } from '@/domains/grid/validate-config';
import { NextResponse } from 'next/server';

import { loadRandomCategories } from '@/domains/grid/categories.server';
import { DAILY_GRID_CONFIG } from '@/domains/grid/config';
import { generateGrid, selectCategoryCounts } from '@/domains/grid/generator';

export async function GET() {
  try {
    const bounds = validateGridConfig(DAILY_GRID_CONFIG);
    const counts = selectCategoryCounts(bounds);
    const categories = await loadRandomCategories(counts);
    const grid = generateGrid(categories);
    return NextResponse.json(
      { data: grid },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Failed to generate grid:', error);

    return NextResponse.json(
      { error: 'Failed to generate grid' },
      { status: 500 }
    );
  }
}
