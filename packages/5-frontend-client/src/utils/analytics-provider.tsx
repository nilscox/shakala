import { createInstance, MatomoProvider, useMatomo } from '@jonkoops/matomo-tracker-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef } from 'react';

import { getPublicConfig } from './config';

// cspell:word matomo jonkoops

type AnalyticsProviderProps = {
  children: React.ReactNode;
};

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const { analyticsUrl, analyticsSiteId } = getPublicConfig();

  const instance = useMemo(() => {
    if (!analyticsUrl || !analyticsSiteId) {
      return;
    }

    return createInstance({
      urlBase: analyticsUrl,
      siteId: analyticsSiteId,
      linkTracking: false,
    });
  }, [analyticsUrl, analyticsSiteId]);

  if (!instance) {
    return <>{children}</>;
  }

  return (
    <MatomoProvider value={instance}>
      <TrackPageViews />
      <LinkTracking />
      {children}
    </MatomoProvider>
  );
};

const TrackPageViews = () => {
  const router = useRouter();
  const { trackPageView } = useMatomo();
  const lastUrl = useRef<string>();

  useEffect(() => {
    const handler = (url: string) => {
      // events are fired twice
      if (url !== lastUrl.current) {
        trackPageView();
      }

      lastUrl.current = url;
    };

    router.events.on('routeChangeComplete', handler);
    return () => router.events.off('routeChangeComplete', handler);
  }, [router, trackPageView]);

  return null;
};

const LinkTracking = () => {
  const { enableLinkTracking } = useMatomo();

  enableLinkTracking();

  return null;
};
