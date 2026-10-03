'use client';

import {
  useMutation,
  type UseMutateAsyncFunction,
  type UseMutationResult,
} from '@tanstack/react-query';

import { GridApi } from '../requests/GridApi';
import type {
  ValidateAnswerRequest,
  ValidateAnswerResponse,
} from '../types/validate.answer';

interface UseValidateAnswerResult
  extends Omit<
    UseMutationResult<
      ValidateAnswerResponse['data'],
      Error,
      ValidateAnswerRequest
    >,
    'mutateAsync'
  > {
  validateAnswer: UseMutateAsyncFunction<
    ValidateAnswerResponse['data'],
    Error,
    ValidateAnswerRequest
  >;
}

export const useValidateAnswer = (): UseValidateAnswerResult => {
  const mutationFn = async (
    payload: ValidateAnswerRequest
  ): Promise<ValidateAnswerResponse['data']> => {
    return await GridApi.validateAnswer(payload);
  };

  const { mutateAsync, ...rest } = useMutation({
    mutationFn,
  });

  return {
    validateAnswer: mutateAsync,
    ...rest,
  };
};
