import { EmailRenderer } from '../../entities/email';

export interface EmailCompilerPort {
  compile(templateText: string, templateHtml: string): EmailRenderer;
}
