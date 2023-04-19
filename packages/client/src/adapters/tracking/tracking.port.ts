export interface TrackingPort {
  trackPageView(url: string): void;
  trackEvent(category: string, action: string, options?: { name?: string; value?: number }): void;
}
