import { createTransport, Transporter } from 'nodemailer';

import { MjmlEmailService } from './mjml-email.service';

vi.mock('nodemailer');
const mockCreateTransport = vi.mocked(createTransport);

describe('MjmlEmailService', () => {
  const service = new MjmlEmailService();

  it('compiles an email template with MJML', () => {
    const render = service.compile(
      'hello {{name}}',
      '<mjml><mj-body><mj-section><mj-column><mj-text>hello {{name}}</mj-text></mj-body></mj-column><mj-section></mjml>',
    );

    expect(render({ name: 'you' })).toEqual({
      text: 'hello you',
      html: expect.stringMatching(/hello you/),
    });
  });

  it('throws when the mjml body is incorrect', () => {
    expect(() => service.compile('hello {{name}}', '<html><body /></html>')).toThrow();
  });

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
