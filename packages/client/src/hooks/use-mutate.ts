import { AnyFunction } from '@shakala/shared';
import { Token } from 'brandi';
import { useInjection } from 'brandi-react';
import { useCallback } from 'react';
import { useMutation as useReactMutation, useQueryClient } from 'react-query';

import { getQueryKey, QueryKey } from '~/utils/query-key';

type UseMutationOptions<Result> = {
  invalidate?: QueryKey;
  onSuccess?: (result: Result) => void;
};

export const useMutate = <Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  adapterToken: Token<Adapter>,
  method: Method,
  options?: UseMutationOptions<ReturnType<Adapter[Method]>>
) => {
  const queryClient = useQueryClient();
  const adapter = useInjection(adapterToken);

  const queryKey = getQueryKey(adapterToken, method, ...([] as never));

  const execute = (params: Parameters<Adapter[Method]>) => {
    return adapter[method](...params);
  };

  const { error, mutate } = useReactMutation(queryKey, execute, {
    onSuccess: (result: ReturnType<Adapter[Method]>) => {
      options?.onSuccess?.(result);

      if (options?.invalidate) {
        void queryClient.invalidateQueries({ queryKey: options.invalidate });
      }
    },
  });

  if (error) {
    throw error;
  }

  return useCallback(
    (...params: Parameters<Adapter[Method]>) => {
      return mutate(params);
    },
    [mutate]
  );
};
