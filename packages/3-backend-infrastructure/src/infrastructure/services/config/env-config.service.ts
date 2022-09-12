import dotenv from 'dotenv';

import {
  ConfigService,
  AppConfig,
  CorsConfig,
  SessionConfig,
  DatabaseConfig,
  dumpConfig,
} from './config.service';

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
      apiBaseUrl: this.get('API_BASE_URL'),
      appBaseUrl: this.get('APP_BASE_URL'),
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
