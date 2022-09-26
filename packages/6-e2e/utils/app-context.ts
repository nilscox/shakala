import fs from 'fs/promises';

import { Browser, BrowserContext, expect, Page } from '@playwright/test';
import {
  ExecutionContext,
  GetUserByEmailQuery,
  LoggerPort,
  SignupCommand,
  ValidateEmailAddressCommand,
} from 'backend-application';
import { User } from 'backend-domain';
import { Application, ClearDatabaseCommand, EnvConfigAdapter } from 'backend-infrastructure';
import { Dependencies } from 'frontend-domain';
import { AuthUserDto, wait } from 'shared';

import { AppAccessors } from './app-accessors';

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

  async clearEmails() {
    const response = await fetch('http://localhost:1080/email/all', { method: 'DELETE' });
    const body = await response.json();

    expect(response.ok, JSON.stringify(body)).toBe(true);
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

    // wait for the email to be sent
    await wait(100);
  }

  async getEmailValidationLink(emailAddress: string): Promise<string> {
    type Email = {
      to: Array<{ address: string }>;
      text: string;
    };

    const response = await fetch('http://localhost:1080/email');
    const body = (await response.json()) as Email[];

    expect(response.ok).toBe(true);

    const email = body.find(({ to }) => to[0].address === emailAddress);

    expect(email).toBeDefined();

    const { text } = email as Email;
    const match = text.match(/http.*\n/);

    expect(match).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return match![0].trimEnd();
  }

  async validateEmailAddress(email: string) {
    const user = await this.backend.run<User>(async ({ queryBus }) => {
      return queryBus.execute(new GetUserByEmailQuery(email));
    });

    await this.backend.run(async ({ commandBus }) => {
      await commandBus.execute(
        new ValidateEmailAddressCommand(user.id, user.emailValidationToken as string),
        ExecutionContext.unauthenticated,
      );
    });
  }

  async login(nick: string): Promise<AuthUserDto> {
    const { email, password } = this.credentials(nick);

    await this.createUser(nick);
    await this.validateEmailAddress(email);

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
