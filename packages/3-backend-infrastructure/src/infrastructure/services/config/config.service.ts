export type AppConfig = {
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

export interface ConfigService {
  app(): AppConfig;
  cors(): CorsConfig;
  session(): SessionConfig;
  database(): DatabaseConfig;
  dump(): unknown;
}

export const dumpConfig = (service: ConfigService) => () => {
  const app = service.app();
  const cors = service.cors();
  const session = service.session();
  const database = service.database();

  return {
    app,
    cors,
    session: {
      ...session,
      secret: '[masked]',
    },
    database: {
      ...database,
      password: '[masked]',
    },
  };
};
