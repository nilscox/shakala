import { AnyFunction } from '@shakala/shared';
import { Token } from 'brandi';
import { useInjection } from 'brandi-react';
import { useCallback } from 'react';
import { useMutation as useReactMutation, useQueryClient } from 'react-query';

import { container } from '~/app/container';

export const invalidateQuery = <Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  adapterToken: Token<Adapter>,
  method: Method,
  ...params: Parameters<Adapter[Method]>
) => {
  return [container.get(adapterToken).constructor.name, method, params];
};

type UseMutationOptions<Result> = {
  onSuccess?: (result: Result) => void;
  invalidate?: ReturnType<typeof invalidateQuery>;
};

export const useMutate = <Adapter extends Record<Method, AnyFunction>, Method extends keyof Adapter>(
  adapterToken: Token<Adapter>,
  method: Method,
  options?: UseMutationOptions<ReturnType<Adapter[Method]>>
) => {
  const queryClient = useQueryClient();
  const adapter = useInjection(adapterToken);

  const queryKey = [adapter.constructor.name, method];

  const execute = (params: Parameters<Adapter[Method]>) => {
    return adapter[method](...params);
  };

  const { error, mutate } = useReactMutation(queryKey, execute, {
    onSuccess: (result: ReturnType<Adapter[Method]>) => {
      options?.onSuccess?.(result);
      options?.invalidate?.forEach((queryKey: unknown[]) => queryClient.invalidateQueries({ queryKey }));
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
