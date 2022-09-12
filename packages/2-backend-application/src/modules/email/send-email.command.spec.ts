import { Email } from '../../interfaces/email-sender.service';
import { InMemoryEmailCompilerService } from '../../utils/in-memory-email-compiler.service';
import { InMemoryEmailSenderService } from '../../utils/in-memory-email-sender.service';
import { FilesystemObject, InMemoryFilesystemService } from '../../utils/in-memory-filesystem.service';

import { EmailKind, SendEmailCommand, SendEmailHandler } from './send-email.command';

describe('SendEmailCommand', () => {
  it('sends a welcome email to a user', async () => {
    const fs: FilesystemObject = {
      [`${__dirname}/templates/welcome.txt`]: 'Welcome {nick}',
      [`${__dirname}/templates/welcome.mjml`]: '<p>Welcome {nick}</p>',
    };

    const filesystemService = new InMemoryFilesystemService(fs);
    const emailCompilerService = new InMemoryEmailCompilerService();
    const emailSenderService = new InMemoryEmailSenderService();

    const handler = new SendEmailHandler(filesystemService, emailCompilerService, emailSenderService);

    await handler.init();

    handler.handle(
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
