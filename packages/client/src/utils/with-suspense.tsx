import { ForwardedRef, forwardRef, Suspense, useEffect, useState } from 'react';

import { Spinner } from '~/elements/spinner';

export const withSuspense = <Ref, Props>(
  Component: React.ComponentType<{ ref: ForwardedRef<Ref> } & Props>,
  Loader_: React.ComponentType = Loader
) => {
  const WithSuspense = forwardRef<Ref, Props>((props, ref) => (
    <Suspense fallback={<Loader_ />}>
      <Component ref={ref} {...props} />
    </Suspense>
  ));

  return WithSuspense;
};

const Loader = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  return <div className="col min-h-1 items-center justify-center">{show && <Spinner />}</div>;
};
