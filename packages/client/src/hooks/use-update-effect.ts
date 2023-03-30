import { useRef, useEffect } from 'react';

export const useUpdateEffect = (effect: React.EffectCallback, deps: React.DependencyList) => {
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      effect();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
