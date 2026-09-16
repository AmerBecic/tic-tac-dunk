export const CATEGORY_TYPES = [
  'TEAM',
  'TEAMMATE',
  'ACHIEVEMENT',
  'STAT',
] as const;
export type CategoryType = (typeof CATEGORY_TYPES)[number];
export type CategoryRule = { min?: number; max?: number };
export type GridGenerationConfig = {
  categoryRules: Partial<Record<CategoryType, CategoryRule>>;
};
export type GridCategory = {
  id: string;
  type: CategoryType;
  label: string;
  includedNames?: string[];
};
export type GeneratedGrid = {
  rows: GridCategory[];
  columns: GridCategory[];
};
