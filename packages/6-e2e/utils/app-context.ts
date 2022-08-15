import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoggerService, SignupCommand } from 'backend-application';
import { Application, StubConfigService, ClearDatabaseCommand } from 'backend-infrastructure';
import { Dependencies } from 'frontend-domain';
import { AuthUserDto } from 'shared';

import { AppAccessors } from './app-accessors';

import './hooks';

declare global {
  interface Window {
    dependencies: Dependencies;
  }
}

const noop = () => {};
const loggerService: LoggerService = {
  log: noop,
  info: noop,
  error: noop,
};

export class AppContext extends AppAccessors {
  private backend = new Application();

  constructor(private ctx: BrowserContext, private page: Page) {
    super(page);
  }

  static async create(browser: Browser) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    const app = new AppContext(ctx, page);

    app.backend.overrideServices({
      loggerService,
      configService: new StubConfigService({
        database: {
          host: 'postgres',
          user: 'user',
          password: 'password',
          database: 'shakala-e2e',
        },
      }),
    });

    await app.backend.init();

    ctx.on('close', async () => {
      await app.backend.close();
    });

    return app;
  }

  async clearDatabase() {
    await this.backend.run(async ({ commandBus }) => {
      await commandBus.execute(new ClearDatabaseCommand());
    });
  }

  private credentials(nick: string) {
    return {
      email: `${nick.toLowerCase()}@localhost.tld`,
      password: 'password',
    };
  }

  async createUser(nick: string) {
    const { email, password } = this.credentials(nick);

    await this.backend.run(async ({ commandBus }) => {
      await commandBus.execute(new SignupCommand(nick, email, password));
    });
  }

  async login(nick: string): Promise<AuthUserDto> {
    const { email, password } = this.credentials(nick);

    await this.createUser(nick);

    const user = await this.page.evaluate(
      async ([email, password]) => {
        return window.dependencies.authenticationGateway.login(email, password);
      },
      [email, password],
    );

    return user;
  }

  async reload() {
    await this.page.reload();
  }

  async navigate(url: string | URL) {
    await this.page.goto(String(url));
    this._locator = this.page.locator('html');
  }

  async clearAuthentication() {
    await this.ctx.clearCookies();
  }

  get url() {
    return new URL(this.page.url());
  }

  get searchParams() {
    return this.url.searchParams;
  }
}
