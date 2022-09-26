import {
  FakeEmailCompilerAdapter,
  InMemoryEmailSenderAdapter,
  FilesystemObject,
  InMemoryFilesystemAdapter,
} from '../../../adapters';
import { Email } from '../../../interfaces';

import { EmailKind, SendEmailCommand, SendEmailHandler } from './send-email.command';

describe('SendEmailCommand', () => {
  const emailCompiler = new FakeEmailCompilerAdapter();
  const emailSender = new InMemoryEmailSenderAdapter();

  it('sends a welcome email to a user', async () => {
    const fs: FilesystemObject = {
      'welcome.txt': 'Welcome {nick}',
      'welcome.mjml': '<p>Welcome {nick}</p>',
    };

    const handler = new SendEmailHandler(new InMemoryFilesystemAdapter(fs), emailCompiler, emailSender);

    await handler.init();

    await handler.handle(
      new SendEmailCommand('user@domain.tld', EmailKind.welcome, {
        nick: 'tamer',
        emailValidationLink: '',
      }),
    );

    const expected: Email = {
      to: 'user@domain.tld',
      subject: 'Bienvenue sur Shakala !',
      body: {
        text: 'Welcome tamer',
        html: '<p>Welcome tamer</p>',
      },
    };

    expect(emailSender.lastSentEmail).toEqual(expected);
  });
});
