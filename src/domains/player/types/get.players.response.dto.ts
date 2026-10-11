import type { PaginatedResponse } from '@/server/types/api.types';
import type { Player } from './player.types';

export type GetPlayersResponse = PaginatedResponse<{ players: Player[] }>;
