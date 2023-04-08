import expect from '@nilscox/expect';
import { StubConfigAdapter, StubFilesystemAdapter } from '@shakala/common';
import { beforeEach, describe, it } from 'vitest';

import { EmailKind } from '../../entities/emails-payloads';
import { FakeEmailCompilerAdapter } from '../email-compiler/fake-email-compiler.adapter';
import { StubEmailSenderAdapter } from '../email-sender/stub-email-sender.adapter';

import { EmailRendererAdapter } from './email-renderer.adapter';
import { FakeEmailRendererAdapter } from './fake-email-renderer.adapter';

describe('[unit] EmailRendererAdapter', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.arrange();
  });

  it('renders a welcome email', () => {
    const body = test.act(EmailKind.welcome, {
      appBaseUrl: '',
      emailValidationLink: '',
      nick: 'biloute',
    });

    expect(body).toEqual({
      html: '<p>Welcome biloute</p>',
      text: 'Welcome biloute',
    });
  });
});

class Test {
  fs = {
    '/templates/welcome.txt': 'Welcome {nick}',
    '/templates/welcome.mjml': '<p>Welcome {nick}</p>',
  };

  emailRenderer = new FakeEmailRendererAdapter();
  emailCompiler = new FakeEmailCompilerAdapter();
  emailSender = new StubEmailSenderAdapter();

  handler = new EmailRendererAdapter(
    new StubConfigAdapter({ email: { templatesPath: '/templates' } }),
    new StubFilesystemAdapter(this.fs),
    this.emailCompiler
  );

  async arrange() {
    await this.handler.init();
  }

  act = this.handler.render.bind(this.handler);
}
