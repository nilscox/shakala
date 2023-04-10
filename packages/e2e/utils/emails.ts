import { expect } from '@playwright/test';

const maildevApi = () => {
  const { MAILDEV_API_HOST: host, MAILDEV_API_PORT: port } = process.env;
  return `http://${host}:${port}`;
};

export async function clearEmails() {
  const response = await fetch(`${maildevApi()}/email/all`, { method: 'DELETE' });
  const body = await response.json();

  expect(response.ok, JSON.stringify(body)).toBe(true);
}

async function findEmailValidationLink(emailAddress: string): Promise<string> {
  type Email = {
    to: Array<{ address: string }>;
    text: string;
  };

  const response = await fetch(`${maildevApi()}/email`);
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

export async function getEmailValidationLink(email: string): Promise<string> {
  let link: string | undefined;

  await expect
    .poll(
      async () => {
        try {
          link = await findEmailValidationLink(email);
          return link;
        } catch {
          return undefined;
        }
      },
      {
        timeout: 10 * 1000,
        message: 'Did not find email validation link',
      }
    )
    .toBeDefined();

  return link as string;
}

export async function validateEmailAddress(email: string) {
  const link = await getEmailValidationLink(email);
  const emailValidationToken = new URL(link).searchParams.get('email-validation-token');

  const { headers } = await fetch('http://localhost:3000/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password' }),
  });

  await fetch(`http://localhost:3000/account/validate-email/${emailValidationToken}`, {
    headers: new Headers({ cookie: headers.get('Set-Cookie') as string }),
  });
}
