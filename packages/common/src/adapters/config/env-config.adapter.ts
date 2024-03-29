import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { injected } from 'brandi';
import dotenv from 'dotenv';

import { AppConfig, ConfigPort, CorsConfig, DatabaseConfig, EmailConfig, SessionConfig } from './config.port';

export class EnvConfigAdapter implements ConfigPort {
  private version = getPackageVersion();

  constructor() {
    dotenv.config();
  }

  private get(key: string, type?: 'string'): string;
  private get(key: string, type: 'number'): number;
  private get(key: string, type: 'boolean'): boolean;

  private get(key: string, type: 'string' | 'number' | 'boolean' = 'string'): string | number | boolean {
    const value = process.env[key];

    if (value === undefined) {
      throw new Error(`Missing environment variable "${key}"`);
    }

    if (type === 'number') {
      const valueAsNumber = Number(value);

      if (Number.isNaN(valueAsNumber)) {
        throw new Error(`invalid environment variable ${key} "${value}"`);
      } else {
        return valueAsNumber;
      }
    }

    if (type === 'boolean') {
      return value === 'true';
    }

    return value;
  }

  private get env() {
    return this.get('NODE_ENV');
  }

  private get isProd() {
    return this.env === 'production';
  }

  get app(): AppConfig {
    return {
      environment: this.env,
      version: this.version,
      host: this.get('HOST'),
      port: this.get('PORT', 'number'),
      trustProxy: this.isProd,
      apiBaseUrl: this.get('API_BASE_URL'),
      appBaseUrl: this.get('APP_BASE_URL'),
    };
  }

  get cors(): CorsConfig {
    return {
      reflectOrigin: !this.isProd,
    };
  }

  get session(): SessionConfig {
    return {
      secure: this.isProd,
      secret: this.get('SESSION_SECRET'),
    };
  }

  get database(): DatabaseConfig {
    return {
      host: this.get('DATABASE_HOST'),
      user: this.get('DATABASE_USER'),
      password: this.get('DATABASE_PASSWORD'),
      database: this.get('DATABASE_NAME'),
      debug: this.get('DATABASE_DEBUG', 'boolean'),
    };
  }

  get email(): EmailConfig {
    return {
      host: this.get('EMAIL_HOST'),
      port: this.get('EMAIL_PORT', 'number'),
      secure: this.get('EMAIL_SECURE', 'boolean'),
      user: this.get('EMAIL_USER'),
      password: this.get('EMAIL_PASSWORD'),
      from: this.get('EMAIL_FROM'),
      templatesPath: this.get('EMAIL_TEMPLATES'),
    };
  }
}

injected(EnvConfigAdapter);

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const getPackageVersion = () => {
  const pkg = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'package.json'));
  const { version } = JSON.parse(String(pkg)) as { version: string };

  return version;
};
