import { createContext, useContext, useEffect, useRef } from 'react';

import { useConfigValue } from '~/hooks/use-config-value';
import { useRouter } from '~/hooks/use-router';

type TrackingProviderProps = {
  children: React.ReactNode;
};

export const TrackingProvider = ({ children }: TrackingProviderProps) => {
  const url = useConfigValue('analyticsUrl');
  const siteId = useConfigValue('analyticsSiteId');

  return (
    <MatomoProvider url={url} siteId={siteId}>
      <TrackPageView />
      {children}
    </MatomoProvider>
  );
};

const TrackPageView = () => {
  const matomo = useMatomoClient();
  const router = useRouter();

  useEffect(() => {
    matomo.trackPageView(window.location.toString());
  }, [matomo, router]);

  return null;
};

export const useTrackEvent = () => {
  return useMatomoClient().trackEvent;
};

// cspell:word matomo

const matomoContext = createContext<MatomoClient>(null as never);

const useMatomoClient = () => {
  return useContext(matomoContext);
};

type MatomoProviderProps = {
  url: string;
  siteId: number;
  children: React.ReactNode;
};

const MatomoProvider = ({ url, siteId, children }: MatomoProviderProps) => {
  const client = useRef(new MatomoClient());

  return (
    <matomoContext.Provider value={client.current}>
      <MatomoScript url={url} siteId={siteId} />
      {children}
    </matomoContext.Provider>
  );
};

type MatomoScriptProps = {
  url: string;
  siteId: number;
};

export const MatomoScript = ({ url, siteId }: MatomoScriptProps) => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
var _paq = window._paq = window._paq || [];

_paq.push(['enableLinkTracking']);

(function() {
  var u="${url}/";

  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', ${siteId}]);

  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();
  `,
      }}
    />
  );
};

declare global {
  interface Window {
    _paq: unknown[][];
  }
}

class MatomoClient {
  private _paq: unknown[][] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this._paq = window._paq = window._paq ?? [];
    }
  }

  trackPageView = (url: string) => {
    this._paq.push(['setCustomUrl', url]);
    this._paq.push(['trackPageView']);
  };

  trackEvent = (
    category: string,
    action: string,
    { name, value }: { name?: string; value?: number } = {}
  ) => {
    this._paq.push(['trackEvent', category, action, name, value]);
  };
}
