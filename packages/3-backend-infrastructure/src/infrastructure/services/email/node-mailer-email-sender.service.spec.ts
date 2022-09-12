import { createTransport, Transporter } from 'nodemailer';

import { EmailConfig } from '../config/config.service';
import { StubConfigService } from '../config/stub-config.service';

import { NodeMailerEmailSenderService } from './node-mailer-email-sender.service';

vi.mock('nodemailer');
const mockCreateTransport = vi.mocked(createTransport);

describe('NodeMailerEmailSenderService', () => {
  const emailConfig: EmailConfig = {
    host: 'host',
    port: 2525,
    secure: true,
    user: 'hello@domain.fr',
    password: 'password',
    from: 'Someone',
  };

  const config = new StubConfigService({ email: emailConfig });
  const service = new NodeMailerEmailSenderService(config);

  it('sends an email', async () => {
    const sendMail = vi.fn();

    mockCreateTransport.mockReturnValue({
      sendMail,
    } as unknown as Transporter<unknown>);

    await service.send({
      to: 'you',
      subject: 'hello',
      body: {
        text: 'how are you?',
        html: '<p>how are you?</p>',
      },
    });

    expect(sendMail).toHaveBeenCalledWith({
      from: 'Someone <hello@domain.fr>',
      to: 'you',
      subject: 'hello',
      text: 'how are you?',
      html: '<p>how are you?</p>',
    });
  });
});
