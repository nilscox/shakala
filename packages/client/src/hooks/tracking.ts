import { useInjection } from 'brandi-react';
import { useEffect } from 'react';

import { TOKENS } from '~/app/tokens';
import { useRouter } from '~/hooks/use-router';

export const useTrackPageViews = () => {
  const trackingAdapter = useInjection(TOKENS.tracking);
  const router = useRouter();

  useEffect(() => {
    trackingAdapter.trackPageView(window.location.toString());
  }, [trackingAdapter, router]);
};

export const useTrackEvent = () => {
  const trackingAdapter = useInjection(TOKENS.tracking);
  return trackingAdapter.trackEvent;
};
