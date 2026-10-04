'use client';

import {
  useMutation,
  type UseMutateAsyncFunction,
  type UseMutationResult,
} from '@tanstack/react-query';

import { TicTacToeApi } from '../requests/TicTacToeApi';
import type { CreateMatchRequest } from '../types/create.match.request.dto';
import type { CreateMatchResponse } from '../types/create.match.response.dto';

interface UseCreateTicTacToeMatchResult
  extends Omit<
    UseMutationResult<CreateMatchResponse['data'], Error, CreateMatchRequest>,
    'mutateAsync'
  > {
  createTicTacToeMatch: UseMutateAsyncFunction<
    CreateMatchResponse['data'],
    Error,
    CreateMatchRequest
  >;
}

export const useCreateTicTacToeMatch = (): UseCreateTicTacToeMatchResult => {
  const mutationFn = async (
    payload: CreateMatchRequest
  ): Promise<CreateMatchResponse['data']> => {
    return await TicTacToeApi.createMatch(payload);
  };

  const { mutateAsync, ...rest } = useMutation({ mutationFn });

  return {
    createTicTacToeMatch: mutateAsync,
    ...rest,
  };
};
