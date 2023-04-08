import { AnyFunction } from '@shakala/shared';
import { Token } from 'brandi';
import { useInjection } from 'brandi-react';
import { useCallback } from 'react';
import { useMutation as useReactMutation, useQueryClient } from 'react-query';

import { getQueryKey, QueryKey } from '~/utils/query-key';

type UseMutationOptions<Result> = {
  invalidate?: QueryKey | QueryKey[];
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
      if (options?.invalidate) {
        const invalidate = Array.isArray(options.invalidate[0])
          ? (options.invalidate as QueryKey[])
          : ([options.invalidate] as QueryKey[]);

        invalidate.forEach((queryKey) => {
          void queryClient.invalidateQueries({ queryKey });
        });
      }

      options?.onSuccess?.(result);
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
