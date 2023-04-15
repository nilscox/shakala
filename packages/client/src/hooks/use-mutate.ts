import { AnyFunction } from '@shakala/shared';
import { Token } from 'brandi';
import { useInjection } from 'brandi-react';
import { useCallback } from 'react';
import { useMutation as useReactMutation } from 'react-query';

import { getQueryKeyWithoutParams } from '~/utils/query-key';

import { useErrorHandler } from './use-error-handler';

type UseMutationOptions<Result> = {
  onSuccess?: (result: Result) => void;
  onError?: (error: unknown) => void;
  onCompleted?: () => void;
};

export const useMutate = <Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  adapterToken: Token<Adapter>,
  method: Method,
  options?: UseMutationOptions<ReturnType<Adapter[Method]>>
) => {
  const adapter = useInjection(adapterToken);
  const queryKey = getQueryKeyWithoutParams(adapterToken, method);

  const handleError = useErrorHandler();

  const execute = (params: Parameters<Adapter[Method]>) => {
    return adapter[method](...params);
  };

  const { mutate } = useReactMutation(queryKey, execute, {
    onSuccess: options?.onSuccess,
    onError: options?.onError ?? handleError,
    onSettled: options?.onCompleted,
  });

  return useCallback(
    (...params: Parameters<Adapter[Method]>) => {
      return mutate(params);
    },
    [mutate]
  );
};
