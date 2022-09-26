import { Email } from '../../interfaces/email-sender.port';
import { InMemoryEmailCompilerAdapter } from '../../utils/in-memory-email-compiler.adapter';
import { InMemoryEmailSenderAdapter } from '../../utils/in-memory-email-sender.adapter';
import { FilesystemObject, InMemoryFilesystemAdapter } from '../../utils/in-memory-filesystem.adapter';

import { EmailKind, SendEmailCommand, SendEmailHandler } from './send-email.command';

describe('SendEmailCommand', () => {
  const emailCompiler = new InMemoryEmailCompilerAdapter();
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
