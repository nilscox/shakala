import { AppConfig, CorsConfig, SessionConfig, DatabaseConfig } from './config.service';
import { StubConfigService } from './stub-config.service';

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
        database: 'test',
      },
    });
  }
}
