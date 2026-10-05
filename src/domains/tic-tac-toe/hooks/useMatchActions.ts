'use client';

import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/core/api/Api';
import { GET_TIC_TAC_TOE_MATCHES_QUERY_KEY } from '@/core/constants/QueryKeys';
import { TicTacToeApi } from '../requests/TicTacToeApi';
import type { MatchActionRequest } from '../types/match.action.request.dto';

type MoveInput = Omit<
  Extract<MatchActionRequest, { action: 'MOVE' }>,
  'action'
>;
type VersionInput = Pick<MatchActionRequest, 'expectedVersion'>;

export const useMatchActions = (matchId: string) => {
  const queryClient = useQueryClient();
  const refreshMatches = () =>
    queryClient.invalidateQueries({
      queryKey: [GET_TIC_TAC_TOE_MATCHES_QUERY_KEY],
    });
  const { mutate, mutateAsync, ...state } = useMutation({
    mutationFn: (input: MatchActionRequest) =>
      TicTacToeApi.updateMatch(matchId, input),
    retry: false,
    onSuccess: async () => {
      await refreshMatches();
    },
    onError: async (error: Error) => {
      if (error instanceof ApiError && error.status === 409)
        await refreshMatches();
    },
  });
  void mutate;
  const expireTurn = useCallback(
    (input: VersionInput) => mutateAsync({ ...input, action: 'TIMEOUT' }),
    [mutateAsync]
  );
  return {
    ...state,
    expireTurn,
    submitMove: (input: MoveInput) => mutateAsync({ ...input, action: 'MOVE' }),
    skipTurn: (input: VersionInput) =>
      mutateAsync({ ...input, action: 'SKIP' }),
    forfeitMatch: (input: VersionInput) =>
      mutateAsync({ ...input, action: 'FORFEIT' }),
    offerDraw: (input: VersionInput) =>
      mutateAsync({ ...input, action: 'OFFER_DRAW' }),
    acceptDraw: (input: VersionInput) =>
      mutateAsync({ ...input, action: 'ACCEPT_DRAW' }),
    declineDraw: (input: VersionInput) =>
      mutateAsync({ ...input, action: 'DECLINE_DRAW' }),
  };
};
