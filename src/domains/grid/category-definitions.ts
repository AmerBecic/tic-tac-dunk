import type { GridCategory } from './types';

export const ACHIEVEMENT_CATEGORIES: GridCategory[] = [
  { id: 'ACHIEVEMENT:mvp-or-dpoy', type: 'ACHIEVEMENT', label: 'MVP or DPOY' },
  { id: 'ACHIEVEMENT:roy-or-mip', type: 'ACHIEVEMENT', label: 'ROY or MIP' },
];

export const STAT_CATEGORIES: GridCategory[] = [
  {
    id: 'STAT:season-points:gte:2000',
    type: 'STAT',
    label: '2,000+ points in a season',
  },
];
