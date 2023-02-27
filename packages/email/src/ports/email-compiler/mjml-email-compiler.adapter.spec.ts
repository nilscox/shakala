import { expect, StubConfigAdapter } from '@shakala/common';
import { describe, it } from 'vitest';

import { MjmlEmailCompilerAdapter } from './mjml-email-compiler.adapter';

describe('MjmlEmailCompilerAdapter', () => {
  it('compiles an email template with MJML', () => {
    const emailCompiler = new MjmlEmailCompilerAdapter(new StubConfigAdapter());

    const render = emailCompiler.compile(
      'hello {{name}}',
      '<mjml><mj-body><mj-section><mj-column><mj-text>hello {{name}}</mj-text></mj-body></mj-column><mj-section></mjml>'
    );

    expect(render({ name: 'you' })).toEqual({
      text: 'hello you',
      html: expect.stringMatching(/hello you/),
    });
  });

  it('throws when the mjml body is incorrect', () => {
    const emailCompiler = new MjmlEmailCompilerAdapter(new StubConfigAdapter());

    void expect(() => emailCompiler.compile('hello {{name}}', '<html><body /></html>')).toThrow();
  });
});
