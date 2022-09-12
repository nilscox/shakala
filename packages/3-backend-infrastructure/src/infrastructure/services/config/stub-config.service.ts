import {
  ConfigService,
  AppConfig,
  CorsConfig,
  SessionConfig,
  DatabaseConfig,
  dumpConfig,
  EmailConfig,
} from './config.service';

export class StubConfigService implements ConfigService {
  constructor(
    public config?: Partial<{
      app: Partial<AppConfig>;
      cors: Partial<CorsConfig>;
      session: Partial<SessionConfig>;
      database: Partial<DatabaseConfig>;
      email: Partial<EmailConfig>;
    }>,
  ) {}

  app(): AppConfig {
    return {
      host: 'localhost',
      port: 3000,
      trustProxy: false,
      apiBaseUrl: 'http://localhost:3000',
      appBaseUrl: 'http://localhost:8000',
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

  email(): EmailConfig {
    return {
      host: '',
      port: 0,
      secure: false,
      user: '',
      password: '',
      from: '',
      ...this.config?.email,
    };
  }

  dump = dumpConfig(this);
}
