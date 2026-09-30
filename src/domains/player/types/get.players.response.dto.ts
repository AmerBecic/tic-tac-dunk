import type { PaginatedResponse } from '@/core/types/api.types';
import type { Player } from './player.types';

export type GetPlayersResponse = PaginatedResponse<{ players: Player[] }>;
