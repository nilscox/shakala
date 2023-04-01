import { ForwardedRef, forwardRef, Suspense } from 'react';

export const withSuspense = <Ref, Props>(
  Component: React.ComponentType<{ ref: ForwardedRef<Ref> } & Props>,
  displayName?: string,
  Loader_: React.ComponentType = Loader
) => {
  const WithSuspense = forwardRef<Ref, Props>((props, ref) => (
    <Suspense fallback={<Loader_ />}>
      <Component ref={ref} {...props} />
    </Suspense>
  ));

  if (displayName) {
    Component.displayName = displayName;
    WithSuspense.displayName = `withSuspense(${displayName})`;
  } else {
    WithSuspense.displayName = `withSuspense()`;
  }

  return WithSuspense;
};

const Loader = () => <div className="col min-h-1 items-center justify-center">Loading...</div>;
