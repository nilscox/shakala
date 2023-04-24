import { AppConfig } from './app-config';

const env = {
  DEV: import.meta.env.DEV,
  SSR: import.meta.env.SSR,
  SERVER_API_URL: import.meta.env.VITE_SERVER_API_URL,
  CLIENT_API_URL: import.meta.env.VITE_CLIENT_API_URL,
  ANALYTICS_URL: import.meta.env.VITE_ANALYTICS_URL,
  ANALYTICS_SITE_ID: import.meta.env.VITE_ANALYTICS_SITE_ID,
  CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL,
  DISCORD_URL: import.meta.env.VITE_DISCORD_URL,
  ROADMAP_URL: import.meta.env.VITE_ROADMAP_URL,
  FEEDBACK_URL: import.meta.env.VITE_FEEDBACK_URL,
  REPOSITORY_URL: import.meta.env.VITE_REPOSITORY_URL,
};

export const envConfig: AppConfig = {
  isDevelopment: env.DEV,
  apiBaseUrl: env.SSR ? env.SERVER_API_URL : env.CLIENT_API_URL,
  analyticsUrl: env.ANALYTICS_URL,
  analyticsSiteId: Number(env.ANALYTICS_SITE_ID),
  contactEmail: env.CONTACT_EMAIL,
  discordUrl: env.DISCORD_URL,
  roadmapUrl: env.ROADMAP_URL,
  feedbackUrl: env.FEEDBACK_URL,
  repositoryUrl: env.REPOSITORY_URL,
};
