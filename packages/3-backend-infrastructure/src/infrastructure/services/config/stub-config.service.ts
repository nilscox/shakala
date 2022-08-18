import {
  ConfigService,
  AppConfig,
  CorsConfig,
  SessionConfig,
  DatabaseConfig,
  dumpConfig,
} from './config.service';

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
