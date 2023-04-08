import path from 'path';

import { ConfigPort, FilesystemPort, TOKENS } from '@shakala/common';
import { assert } from '@shakala/shared';
import { injected } from 'brandi';

import { EmailBody, EmailRenderer } from '../../entities/email';
import { EmailKind, EmailPayloadMap } from '../../entities/emails-payloads';
import { EMAIL_TOKENS } from '../../tokens';
import { EmailCompilerPort } from '../email-compiler/email-compiler.port';

import { EmailRendererPort } from './email-renderer.port';

export class EmailRendererAdapter implements EmailRendererPort {
  private renderers = new Map<EmailKind, EmailRenderer>();

  constructor(
    private readonly config: ConfigPort,
    private readonly filesystem: FilesystemPort,
    private readonly emailCompiler: EmailCompilerPort
  ) {}

  async init(): Promise<void> {
    for (const kind of Object.values(EmailKind)) {
      this.renderers.set(kind, await this.loadTemplate(kind));
    }
  }

  render<Kind extends EmailKind>(kind: Kind, payload: EmailPayloadMap[Kind]): EmailBody {
    const renderer = this.renderers.get(kind);

    assert(renderer, `no renderer found for email kind "${kind}"`);

    return renderer(payload);
  }

  private async loadTemplate(kind: EmailKind) {
    const { templatesPath } = this.config.email;

    const templatePath = (ext: string) => {
      return path.join(templatesPath, `${kind}.${ext}`);
    };

    const templateHtml = await this.filesystem.readFile(templatePath('mjml'));
    const templateText = await this.filesystem.readFile(templatePath('txt'));

    return this.emailCompiler.compile(templateText, templateHtml);
  }
}

injected(EmailRendererAdapter, TOKENS.config, TOKENS.filesystem, EMAIL_TOKENS.adapters.emailCompiler);
