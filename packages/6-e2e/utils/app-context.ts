import fs from 'fs/promises';

import { Browser, BrowserContext, Page } from '@playwright/test';
import { ExecutionContext, LoggerPort, SignupCommand } from '@shakala/backend-application';
import { Application, ClearDatabaseCommand, EnvConfigAdapter } from '@shakala/backend-infrastructure';
import { Dependencies } from '@shakala/frontend-domain';
import { AuthUserDto } from '@shakala/shared';

import { AppAccessors } from './app-accessors';
import { Emails } from './emails';
import './hooks';

declare global {
  interface Window {
    dependencies: Dependencies;
  }
}

const noop = () => {};
const logger: LoggerPort = {
  log: noop,
  info: noop,
  error: noop,
};

export class AppContext extends AppAccessors {
  private backend = new Application();

  constructor(private ctx: BrowserContext, private page: Page) {
    super(page);
  }

  get emails() {
    return new Emails(this.backend);
  }

  static async create(browser: Browser) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    const app = new AppContext(ctx, page);

    app.backend.override({
      logger,
      config: new EnvConfigAdapter(),
    });

    await app.backend.init();

    ctx.on('close', async () => {
      await app.backend.close();
    });

    return app;
  }

  async clearDatabase() {
    await this.backend.run(async ({ commandBus }) => {
      await commandBus.execute(new ClearDatabaseCommand(), ExecutionContext.unauthenticated);
    });
  }

  credentials(nick: string) {
    return {
      email: `${nick.toLowerCase()}@localhost.tld`,
      password: 'password',
    };
  }

  async createUser(nick: string) {
    const { email, password } = this.credentials(nick);

    await this.backend.run(async ({ commandBus }) => {
      await commandBus.execute(new SignupCommand(nick, email, password), ExecutionContext.unauthenticated);
    });
  }

  async login(nick: string): Promise<AuthUserDto> {
    const { email, password } = this.credentials(nick);

    await this.createUser(nick);
    await this.emails.validateEmailAddress(email);

    const user = await this.page.evaluate(
      async ([email, password]) => {
        return window.dependencies.authenticationGateway.login(email, password);
      },
      [email, password],
    );

    return user;
  }

  async snapshot(file: string) {
    const html = await this.page.evaluate(() => {
      const html = document.body.parentElement as HTMLElement;
      return html.innerHTML;
    });

    await fs.writeFile(file, html);
  }

  async reload() {
    await this.page.reload();
  }

  async newPage() {
    return new AppContext(this.ctx, await this.ctx.newPage());
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
