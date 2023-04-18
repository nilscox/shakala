import { wait } from '@shakala/shared';

type MailDevEmail = {
  id: string;
  time: string;
  from: [{ address: string; name: string }];
  to: [{ address: string; name: string }];
  subject: string;
  text: string;
  html: string;
  headers: Record<string, string>;
};

const { MAILDEV_HOST = 'localhost', MAILDEV_API_PORT = '1080' } = process.env;

export class MailDevAdapter {
  private baseUrl = `http://${MAILDEV_HOST}:${MAILDEV_API_PORT}`;

  async clear() {
    await wait(200);
    await fetch(`${this.baseUrl}/email/all`, { method: 'DELETE' });
  }

  async all(to?: string): Promise<MailDevEmail[]> {
    const response = await fetch(`${this.baseUrl}/email`);
    const emails: MailDevEmail[] = await response.json();

    if (to === undefined) {
      return emails;
    }

    return emails.filter((email) => email.to.find(({ address }) => address === to));
  }
}
