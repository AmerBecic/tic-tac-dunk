import { NextResponse } from 'next/server';
import { createSupabase } from '@/core/supabase/Server';
import type { GenerateGridResponse } from '@/domains/grid';

import { gridService } from '@/server/grid/services/GridServices';
import { DAILY_GRID_CONFIG, GRID_VALIDATION_ERROR_CODES } from '@/domains/grid';

export async function GET(): Promise<NextResponse<GenerateGridResponse>> {
  try {
    const result = await gridService.generateAndValidate(
      DAILY_GRID_CONFIG,
      createSupabase()
    );

    if (!result.ok) {
      const exhausted =
        result.code === GRID_VALIDATION_ERROR_CODES.ATTEMPTS_EXHAUSTED;
      return NextResponse.json<GenerateGridResponse>(
        {
          error: exhausted ? result.message : 'Failed to generate grid',
          code: result.code,
        },
        { status: exhausted ? 503 : 500 }
      );
    }

    return NextResponse.json<GenerateGridResponse>({ data: result.grid });
  } catch {
    return NextResponse.json<GenerateGridResponse>(
      { error: 'Failed to generate grid' },
      { status: 500 }
    );
  }
}
