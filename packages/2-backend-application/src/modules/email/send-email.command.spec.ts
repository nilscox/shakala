import { Email } from '../../interfaces/email.service';
import { InMemoryEmailService } from '../../utils/in-memory-email.service';
import { FilesystemObject, InMemoryFilesystemService } from '../../utils/in-memory-filesystem.service';

import { EmailKind, SendEmailCommand, SendEmailHandler } from './send-email.command';

describe('SendEmailCommand', () => {
  it('sends a welcome email to a user', async () => {
    const fs: FilesystemObject = {
      [`${__dirname}/templates/welcome.txt`]: 'Welcome {nick}',
      [`${__dirname}/templates/welcome.mjml`]: '<p>Welcome {nick}</p>',
    };

    const filesystemService = new InMemoryFilesystemService(fs);
    const emailService = new InMemoryEmailService();

    const handler = new SendEmailHandler(filesystemService, emailService);

    await handler.init();

    handler.handle(
      new SendEmailCommand('user@domain.tld', EmailKind.welcome, {
        nick: 'tamer',
        emailValidationLink: '',
      }),
    );

    const expected: Email = {
      from: 'hello@shakala.fr',
      to: 'user@domain.tld',
      subject: 'Bienvenue sur Shakala !',
      body: {
        text: 'Welcome tamer',
        html: '<p>Welcome tamer</p>',
      },
    };

    expect(emailService.lastSentEmail).toEqual(expected);
  });
});
