import dotenv from 'dotenv';

type AppConfig = {
  host: string;
  port: number;
  trustProxy: boolean;
};

type CorsConfig = {
  reflectOrigin: boolean;
};

type SessionConfig = {
  secure: boolean;
  secret: string;
  pruneExpiredSessions: boolean;
};

type DatabaseConfig = {
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

const dumpConfig = (service: ConfigService) => () => {
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

export class StubConfigService implements ConfigService {
  constructor(
    public config?: Partial<{
      app: Partial<AppConfig>;
      cors: Partial<CorsConfig>;
      session: Partial<SessionConfig>;
      database: Partial<DatabaseConfig>;
    }>,
  ) {}

  app(): AppConfig {
    return {
      host: 'localhost',
      port: 3000,
      trustProxy: false,
      ...this.config?.app,
    };
  }

  cors(): CorsConfig {
    return {
      reflectOrigin: true,
      ...this.config?.cors,
    };
  }

  session(): SessionConfig {
    return {
      secret: 'secret',
      secure: false,
      pruneExpiredSessions: false,
      ...this.config?.session,
    };
  }

  database(): DatabaseConfig {
    return {
      host: 'localhost',
      user: 'postgres',
      password: '',
      database: 'shakala',
      ...this.config?.database,
    };
  }

  dump = dumpConfig(this);
}

export class TestConfigService extends StubConfigService {
  constructor(
    config?: Partial<{
      app: Partial<AppConfig>;
      cors: Partial<CorsConfig>;
      session: Partial<SessionConfig>;
      database: Partial<DatabaseConfig>;
    }>,
  ) {
    const getEnv = (key: string, defaultValue: string) => {
      return process.env[key] ?? defaultValue;
    };

    super({
      ...config,
      database: {
        host: getEnv('DATABASE_HOST', 'localhost'),
        user: getEnv('DATABASE_USER', ''),
        password: getEnv('DATABASE_PASSWORD', ''),
        database: getEnv('DATABASE_NAME', 'test'),
      },
    });
  }
}

export class EnvConfigService implements ConfigService {
  constructor() {
    dotenv.config();
  }

  private get(key: string): string {
    const value = process.env[key];

    if (value === undefined) {
      throw new Error(`Missing environment variable "${key}"`);
    }

    return value;
  }

  private get env() {
    return this.get('NODE_ENV');
  }

  private get isProd() {
    return this.env === 'production';
  }

  app(): AppConfig {
    const portStr = this.get('PORT');
    const port = Number(portStr);

    if (Number.isNaN(port)) {
      throw new Error(`invalid environment variable PORT "${portStr}"`);
    }

    return {
      host: this.get('HOST'),
      port,
      trustProxy: this.isProd,
    };
  }

  cors(): CorsConfig {
    return {
      reflectOrigin: !this.isProd,
    };
  }

  session(): SessionConfig {
    return {
      secure: this.isProd,
      secret: this.get('SESSION_SECRET'),
      pruneExpiredSessions: true,
    };
  }

  database(): DatabaseConfig {
    return {
      host: this.get('DATABASE_HOST'),
      user: this.get('DATABASE_USER'),
      password: this.get('DATABASE_PASSWORD'),
      database: this.get('DATABASE_NAME'),
    };
  }

  dump = dumpConfig(this);
}
