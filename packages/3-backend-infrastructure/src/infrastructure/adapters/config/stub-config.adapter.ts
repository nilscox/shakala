import { DeepPartial, get } from 'shared';

import {
  ConfigPort,
  AppConfig,
  CorsConfig,
  SessionConfig,
  DatabaseConfig,
  dumpConfig,
  EmailConfig,
} from './config.port';

type Config = {
  app: AppConfig;
  cors: CorsConfig;
  session: SessionConfig;
  database: DatabaseConfig;
  email: EmailConfig;
};

export class StubConfigAdapter implements ConfigPort {
  static defaultConfig: Config = {
    app: {
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
    },
    email: {
      host: '',
      port: NaN,
      secure: false,
      user: '',
      password: '',
      from: '',
    },
  };

  private config: Config;

  constructor(config: DeepPartial<Config> = {}) {
    this.config = merge(StubConfigAdapter.defaultConfig, config);
  }

  app(): AppConfig {
    return this.config.app;
  }

  cors(): CorsConfig {
    return this.config.cors;
  }

  session(): SessionConfig {
    return this.config.session;
  }

  database(): DatabaseConfig {
    return this.config.database;
  }

  email(): EmailConfig {
    return this.config.email;
  }

  dump = dumpConfig(this);

  withEnvDatabase(): StubConfigAdapter {
    const getEnv = (key: string, defaultValue: string) => {
      return process.env[key] ?? defaultValue;
    };

    const { database } = this.config;

    database.host ||= getEnv('DATABASE_HOST', 'localhost');
    database.user ||= getEnv('DATABASE_USER', 'postgres');
    database.password ||= getEnv('DATABASE_PASSWORD', '');
    database.database ||= getEnv('DATABASE_NAME', 'shakala');

    if (getEnv('NODE_ENV', 'development') === 'test') {
      database.database = 'test';
    }

    return this;
  }
}

const merge = <T extends object>(left: T, right: DeepPartial<T>): T => {
  if (typeof left !== 'object') {
    return (right as T) ?? left;
  }

  return Object.entries(left).reduce(
    (obj, [key, value]) => ({ ...obj, [key]: merge(value, get(right, key)) }),
    {} as T,
  );
};
