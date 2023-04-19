import { injected } from 'brandi';
import { useInjection } from 'brandi-react';

import { TOKENS } from '~/app/tokens';

import { AppConfig } from '../config/app-config';

import { TrackingPort } from './tracking.port';

export class MatomoTrackingAdapter implements TrackingPort {
  private client: MatomoClient;

  constructor(config: AppConfig) {
    this.client = new MatomoClient({
      url: config.analyticsUrl,
      siteId: config.analyticsSiteId,
    });
  }

  trackPageView = (url: string) => {
    this.client.trackPageView(url);
  };

  trackEvent = (category: string, action: string, options?: { name?: string; value?: number }) => {
    this.client.trackEvent(category, action, options);
  };

  get snippet() {
    return this.client.snippet;
  }
}

injected(MatomoTrackingAdapter, TOKENS.config);

declare global {
  interface Window {
    _paq: unknown[][];
  }
}

class MatomoClient {
  private _paq: unknown[][] = [];

  constructor(private readonly config: Partial<{ url: string; siteId: number }>) {
    if (typeof window !== 'undefined') {
      this._paq = window._paq = window._paq ?? [];
    }
  }

  trackPageView(url: string) {
    this._paq.push(['setCustomUrl', url]);
    this._paq.push(['trackPageView']);
  }

  trackEvent(category: string, action: string, { name, value }: { name?: string; value?: number } = {}) {
    this._paq.push(['trackEvent', category, action, name, value]);
  }

  get snippet() {
    const { url, siteId } = this.config;

    if (!url || !siteId) {
      return undefined;
    }

    return `
var _paq = window._paq = window._paq || [];

_paq.push(['enableLinkTracking']);

(function() {
  var u="${url}/";

  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', ${siteId}]);

  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();`;
  }
}

export const MatomoScript = () => {
  const client = useInjection(TOKENS.tracking);

  if (client instanceof MatomoTrackingAdapter && client.snippet) {
    return <script dangerouslySetInnerHTML={{ __html: client.snippet }} />;
  }

  return null;
};
