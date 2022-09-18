import { Email } from '../../interfaces/email-sender.service';
import { InMemoryEmailCompilerService } from '../../utils/in-memory-email-compiler.service';
import { InMemoryEmailSenderService } from '../../utils/in-memory-email-sender.service';
import { FilesystemObject, InMemoryFilesystemService } from '../../utils/in-memory-filesystem.service';

import { EmailKind, SendEmailCommand, SendEmailHandler } from './send-email.command';

describe('SendEmailCommand', () => {
  const emailCompilerService = new InMemoryEmailCompilerService();
  const emailSenderService = new InMemoryEmailSenderService();

  it('sends a welcome email to a user', async () => {
    const fs: FilesystemObject = {
      'welcome.txt': 'Welcome {nick}',
      'welcome.mjml': '<p>Welcome {nick}</p>',
    };

    const handler = new SendEmailHandler(
      new InMemoryFilesystemService(fs),
      emailCompilerService,
      emailSenderService,
    );

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

    expect(emailSenderService.lastSentEmail).toEqual(expected);
  });
});
