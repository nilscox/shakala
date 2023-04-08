import { AnyFunction } from '@shakala/shared';
import { Token } from 'brandi';
import { useInjection } from 'brandi-react';
import { useCallback } from 'react';
import { useMutation as useReactMutation } from 'react-query';

import { getQueryKey } from '~/utils/query-key';

import { useErrorHandler } from './use-error-handler';

type UseMutationOptions<Result> = {
  onSuccess?: (result: Result) => void;
};

export const useMutate = <Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  adapterToken: Token<Adapter>,
  method: Method,
  options?: UseMutationOptions<ReturnType<Adapter[Method]>>
) => {
  const adapter = useInjection(adapterToken);
  const queryKey = getQueryKey(adapterToken, method, ...([] as never));

  const execute = (params: Parameters<Adapter[Method]>) => {
    return adapter[method](...params);
  };

  const { mutate } = useReactMutation(queryKey, execute, {
    onSuccess: options?.onSuccess,
    onError: useErrorHandler(),
  });

  return useCallback(
    (...params: Parameters<Adapter[Method]>) => {
      return mutate(params);
    },
    [mutate]
  );
};
