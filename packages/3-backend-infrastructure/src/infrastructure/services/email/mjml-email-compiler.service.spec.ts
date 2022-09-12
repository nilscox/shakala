import { MjmlEmailCompilerService } from './mjml-email-compiler.service';

describe('MjmlEmailCompilerService', () => {
  const service = new MjmlEmailCompilerService();

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
});
