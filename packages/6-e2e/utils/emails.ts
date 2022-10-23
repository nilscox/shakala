import { expect } from '@playwright/test';
import { ExecutionContext, GetUserByEmailQuery, ValidateEmailAddressCommand } from 'backend-application';
import { User } from 'backend-domain';
import { Application } from 'backend-infrastructure';

import './hooks';

export class Emails {
  constructor(private backend = new Application()) {}

  private get maildevApi() {
    const { MAILDEV_API_HOST: host, MAILDEV_API_PORT: port } = process.env;
    return `http://${host}:${port}`;
  }

  async clearEmails() {
    const response = await fetch(`${this.maildevApi}/email/all`, { method: 'DELETE' });
    const body = await response.json();

    expect(response.ok, JSON.stringify(body)).toBe(true);
  }

  private async _getEmailValidationLink(emailAddress: string): Promise<string> {
    type Email = {
      to: Array<{ address: string }>;
      text: string;
    };

    const response = await fetch(`${this.maildevApi}/email`);
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

  async getEmailValidationLink(emailAddress: string): Promise<string> {
    let link: string | undefined;

    await expect
      .poll(
        async () => {
          try {
            link = await this._getEmailValidationLink(emailAddress);
          } catch {
            return undefined;
          }

          return link;
        },
        {
          timeout: 10 * 1000,
          message: 'Did find email validation',
        },
      )
      .toBeDefined();

    return link as string;
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
}
