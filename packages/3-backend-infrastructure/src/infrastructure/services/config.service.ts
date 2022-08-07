import dotenv from 'dotenv';

type AppConfig = {
  trustProxy: boolean;
};

type CorsConfig = {
  reflectOrigin: boolean;
};

type SessionConfig = {
  secure: boolean;
  secret: string;
};

export interface ConfigService {
  app(): AppConfig;
  cors(): CorsConfig;
  session(): SessionConfig;
  dump(): unknown;
}

export class StubConfigService implements ConfigService {
  constructor(
    public config?: Partial<{
      app: Partial<AppConfig>;
      cors: Partial<CorsConfig>;
      session: Partial<SessionConfig>;
    }>,
  ) {}

  app(): AppConfig {
    return {
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
      ...this.config?.session,
    };
  }

  dump() {
    return {
      app: this.app(),
      cors: this.cors(),
      session: this.session(),
    };
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
    return {
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
    };
  }

  dump() {
    return {
      app: this.app(),
      cors: this.cors(),
      session: this.session(),
    };
  }
}
