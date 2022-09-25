type Config = {
  apiUrl: string;
  analyticsUrl: string | undefined;
  analyticsSiteId: number | undefined;
};

export const useConfig = (): Config => ({
  apiUrl: String(process.env.API_URL),
  analyticsUrl: process.env.ANALYTICS_URL || undefined,
  analyticsSiteId: parseInt(process.env.ANALYTICS_SITE_ID as string) || undefined,
});
