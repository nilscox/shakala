import { createTransport, Transporter } from 'nodemailer';

import { NodeMailerEmailSenderService } from './node-mailer-email-sender.service';

vi.mock('nodemailer');
const mockCreateTransport = vi.mocked(createTransport);

describe('NodeMailerEmailSenderService', () => {
  const service = new NodeMailerEmailSenderService();

  it('sends an email', async () => {
    const sendMail = vi.fn();

    mockCreateTransport.mockReturnValue({
      sendMail,
    } as unknown as Transporter<unknown>);

    await service.send({
      from: 'me',
      to: 'you',
      subject: 'hello',
      body: {
        text: 'how are you?',
        html: '<p>how are you?</p>',
      },
    });

    expect(sendMail).toHaveBeenCalledWith({
      from: 'me',
      to: 'you',
      subject: 'hello',
      text: 'how are you?',
      html: '<p>how are you?</p>',
    });
  });
});
