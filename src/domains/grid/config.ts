import type { GridGenerationConfig } from './types';

export const DAILY_GRID_CONFIG: GridGenerationConfig = {
  categoryRules: {
    TEAM: { min: 3, max: 5 },
    ACHIEVEMENT: { max: 2 },
    TEAMMATE: { min: 1, max: 3 },
    STAT: { max: 1 },
  },
};
