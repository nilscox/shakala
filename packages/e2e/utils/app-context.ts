import fs from 'fs/promises';

import { Browser, BrowserContext, expect, Page } from '@playwright/test';

import { AppAccessors } from './app-accessors.js';
import { validateEmailAddress } from './emails.js';

export type UserDto = {
  id: string;
  nick: string;
  email: string;
  password: string;
};

export class AppContext extends AppAccessors {
  constructor(private ctx: BrowserContext, private page: Page) {
    super(page);
  }

  static async create(browser: Browser) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    const app = new AppContext(ctx, page);

    return app;
  }

  credentials(nick: string) {
    return {
      email: `${nick.toLowerCase()}@localhost.tld`,
      password: 'password',
    };
  }

  async createUser(nick: string): Promise<UserDto> {
    const { email, password } = this.credentials(nick);
    console.log('create', nick, email, password);

    const response = await fetch('http://localhost:3000/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick, email, password }),
    });

    console.log(await response.clone().text());
    expect(response.status).toEqual(201);

    const user: UserDto = {
      id: await response.text(),
      nick,
      email,
      password,
    };

    await validateEmailAddress(user.email);

    return user;
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.evaluate(
      async ([email, password]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { container, TOKENS } = window as any;
        const authenticationAdapter = container.get(TOKENS.authentication);

        await authenticationAdapter.signIn(email, password);
      },
      [email, password]
    );
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

    // wait for the app to be hydrated
    await new Promise((r) => setTimeout(r, 100));
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
