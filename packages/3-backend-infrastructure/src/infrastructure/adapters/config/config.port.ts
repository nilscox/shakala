export interface ConfigPort {
  app(): AppConfig;
  cors(): CorsConfig;
  session(): SessionConfig;
  database(): DatabaseConfig;
  email(): EmailConfig;
  dump(): unknown;
}

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
  debug: boolean;
};

export type EmailConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
};

export const dumpConfig = (config: ConfigPort) => () => {
  const app = config.app();
  const cors = config.cors();
  const session = config.session();
  const database = config.database();
  const email = config.email();

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
