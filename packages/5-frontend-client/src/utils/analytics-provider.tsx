import { createInstance, MatomoProvider, useMatomo } from '@datapunt/matomo-tracker-react';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { wait } from 'shared';

import { useConfig } from '~/hooks/use-config';

// cspell:word matomo datapunt

type AnalyticsProviderProps = {
  children: React.ReactNode;
};

const MatomoProviderWithChildren = MatomoProvider as React.ComponentType<{
  value: ReturnType<typeof createInstance>;
  children: React.ReactNode;
}>;

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const { analyticsUrl, analyticsSiteId } = useConfig();

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
    <MatomoProviderWithChildren value={instance}>
      <TrackPageViews />
      <LinkTracking />
      {children}
    </MatomoProviderWithChildren>
  );
};

const TrackPageViews = () => {
  const { trackPageView } = useMatomo();
  const location = useLocation();

  useEffect(() => {
    // wait for the page title to be set
    (async () => {
      const initialTitle = document.title;

      for (let i = 0; i < 30; ++i) {
        if (document.title !== initialTitle) {
          break;
        }

        await wait(50);
      }

      trackPageView({});
    })();
  }, [trackPageView, location]);

  return null;
};

const LinkTracking = () => {
  const { enableLinkTracking } = useMatomo();

  enableLinkTracking();

  return null;
};
