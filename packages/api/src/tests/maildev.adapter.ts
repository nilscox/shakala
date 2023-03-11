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

export class MailDevAdapter {
  private baseUrl = `http://localhost:1080`;

  async clear() {
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
