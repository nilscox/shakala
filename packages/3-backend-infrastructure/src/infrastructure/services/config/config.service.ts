export type AppConfig = {
  version: string;
  host: string;
  port: number;
  trustProxy: boolean;
  apiBaseUrl: string;
  appBaseUrl: string;
};

export type CorsConfig = {
  reflectOrigin: boolean;
};

export type SessionConfig = {
  secure: boolean;
  secret: string;
  pruneExpiredSessions: boolean;
};

export type DatabaseConfig = {
  host: string;
  user: string;
  password: string;
  database: string;
};

export type EmailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
};

export interface ConfigService {
  app(): AppConfig;
  cors(): CorsConfig;
  session(): SessionConfig;
  database(): DatabaseConfig;
  email(): EmailConfig;
  dump(): unknown;
}

export const dumpConfig = (service: ConfigService) => () => {
  const app = service.app();
  const cors = service.cors();
  const session = service.session();
  const database = service.database();
  const email = service.email();

  const masked = '[masked]';

  return {
    app,
    cors,
    session: {
      ...session,
      secret: masked,
    },
    database: {
      ...database,
      password: masked,
    },
    email: {
      ...email,
      password: masked,
    },
  };
};
