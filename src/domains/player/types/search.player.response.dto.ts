import type { PaginatedResponse } from '@/core/types/api.types';
import type { Player } from './player.types';

export type SearchPlayersResponse = PaginatedResponse<{ players: Player[] }>;
