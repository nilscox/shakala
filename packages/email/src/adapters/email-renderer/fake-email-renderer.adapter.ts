import { EmailBody } from '../../entities/email';

import { EmailRendererPort } from './email-renderer.port';

export class FakeEmailRendererAdapter implements EmailRendererPort {
  text = '';
  html = '';

  render(): EmailBody {
    return {
      text: this.text,
      html: this.html,
    };
  }
}
