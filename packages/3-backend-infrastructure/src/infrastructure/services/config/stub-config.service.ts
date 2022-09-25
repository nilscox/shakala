import { DeepPartial, get } from 'shared';

import {
  ConfigService,
  AppConfig,
  CorsConfig,
  SessionConfig,
  DatabaseConfig,
  dumpConfig,
  EmailConfig,
} from './config.service';

type Config = {
  app: AppConfig;
  cors: CorsConfig;
  session: SessionConfig;
  database: DatabaseConfig;
  email: EmailConfig;
};

const merge = <T extends object>(left: T, right: DeepPartial<T>): T => {
  if (typeof left !== 'object') {
    return (right as T) ?? left;
  }

  return Object.entries(left).reduce(
    (obj, [key, value]) => ({ ...obj, [key]: merge(value, get(right, key)) }),
    {} as T,
  );
};

export class StubConfigService implements ConfigService {
  static defaultConfig: Config = {
    app: {
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
    this.config = merge(StubConfigService.defaultConfig, config);
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

  withEnvDatabase(): StubConfigService {
    const getEnv = (key: string, defaultValue: string) => {
      return process.env[key] ?? defaultValue;
    };

    Object.assign(this.config.database, {
      host: getEnv('DATABASE_HOST', 'localhost'),
      user: getEnv('DATABASE_USER', 'postgres'),
      password: getEnv('DATABASE_PASSWORD', ''),
      database: getEnv('DATABASE_NAME', 'test'),
    });

    return this;
  }
}
