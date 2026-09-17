import { NextResponse } from 'next/server';

import {
  DAILY_GRID_CONFIG,
  GRID_VALIDATION_ERROR_CODES,
} from '@/domains/grid/GridConstants';
import { gridService } from '@/domains/grid/GridServices';

export async function GET() {
  try {
    const result = await gridService.generateAndValidate(DAILY_GRID_CONFIG);

    if (!result.ok) {
      const exhausted =
        result.code === GRID_VALIDATION_ERROR_CODES.ATTEMPTS_EXHAUSTED;
      return NextResponse.json(
        {
          error: exhausted ? result.message : 'Failed to generate grid',
          code: result.code,
        },
        { status: exhausted ? 503 : 500 }
      );
    }

    return NextResponse.json({ data: result.grid });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate grid' },
      { status: 500 }
    );
  }
}
