import { injected } from 'brandi';

import { TrackingPort } from './tracking.port';

export class StubTrackingAdapter implements TrackingPort {
  public readonly pageViews: string[] = [];
  public readonly events: object[] = [];

  trackPageView = (url: string) => {
    this.pageViews.push(url);
  };

  trackEvent = (category: string, action: string, options: unknown) => {
    this.events.push([category, action, options]);
  };
}

injected(StubTrackingAdapter);
