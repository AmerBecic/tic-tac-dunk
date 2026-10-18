import { NextResponse } from 'next/server';
import { createSupabase } from '@/core/supabase/server';
import type { GenerateGridResponse } from '@/domains/grid/types/generate.grid.response.dto';
import { DEFAULT_GRID_CONFIG } from '@/domains/grid/types/grid.constants';
import { gridService } from '@/server/grid/services/grid.service';
import { handleApiError } from '@/server/errors/handle-api-error';

export async function generateGrid(): Promise<
  NextResponse<GenerateGridResponse>
> {
  try {
    const grid = await gridService.generateAndValidate(
      DEFAULT_GRID_CONFIG,
      createSupabase()
    );
    return NextResponse.json<GenerateGridResponse>({ data: grid });
  } catch (error) {
    return handleApiError(error);
  }
}
