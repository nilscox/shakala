import { DeepPartial, merge } from '@shakala/shared';

import { AppConfig, ConfigPort, CorsConfig, DatabaseConfig, EmailConfig, SessionConfig } from './config.port';

type Config = {
  app: AppConfig;
  cors: CorsConfig;
  session: SessionConfig;
  database: DatabaseConfig;
  email: EmailConfig;
};

export class StubConfigAdapter implements ConfigPort {
  private static defaultConfig: Config = {
    app: {
      environment: '',
      version: '',
      host: '',
      port: NaN,
      trustProxy: false,
      apiBaseUrl: '',
      appBaseUrl: '',
    },
    cors: {
      reflectOrigin: true,
    },
    session: {
      secret: 'secret',
      secure: false,
      pruneExpiredSessions: false,
    },
    database: {
      host: '',
      user: '',
      password: '',
      database: '',
      debug: false,
      allowGlobalContext: false,
    },
    email: {
      host: '',
      port: NaN,
      secure: false,
      user: '',
      password: '',
      from: '',
      templatesPath: '',
    },
  };

  private config: Config;

  constructor(config: DeepPartial<Config> = {}) {
    this.config = merge(StubConfigAdapter.defaultConfig, config);
  }

  get app(): AppConfig {
    return this.config.app;
  }

  get cors(): CorsConfig {
    return this.config.cors;
  }

  get session(): SessionConfig {
    return this.config.session;
  }

  get database(): DatabaseConfig {
    return this.config.database;
  }

  get email(): EmailConfig {
    return this.config.email;
  }
}
