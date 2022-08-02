import dotenv from 'dotenv';

type CorsConfig = {
  reflectOrigin: boolean;
};

type SessionConfig = {
  secure: boolean;
  secret: string;
};

export interface ConfigService {
  cors(): CorsConfig;
  session(): SessionConfig;
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
}
