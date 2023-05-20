import { createContainer } from 'brandi';

import { ApiAccountAdapter } from '~/adapters/api/account/api-account.adapter';
import { ApiAuthenticationAdapter } from '~/adapters/api/authentication/api-authentication.adapter';
import { ApiCommentAdapter } from '~/adapters/api/comment/api-comment.adapter';
import { ApiThreadAdapter } from '~/adapters/api/thread/api-thread.adapter';
import { envConfig } from '~/adapters/config/env-config.adapter';
import { ApiFetchHttpAdapter } from '~/adapters/http/fetch-http.adapter';
import { RichTextEditor } from '~/adapters/rich-text-editor/rich-text-editor.port';
import { tiptapRichTextEditor } from '~/adapters/rich-text-editor/tiptap-rich-text-editor.adapter';
import { VPSRouterAdapter } from '~/adapters/router/vps-router.adapter';
import { MatomoTrackingAdapter } from '~/adapters/tracking/matomo-tracking.adapter';
import { StubTrackingAdapter } from '~/adapters/tracking/stub-tracking.adapter';

import { TOKENS } from './tokens';

export const container = createContainer();

container.bind(TOKENS.config).toConstant(envConfig);
container.bind(TOKENS.router).toInstance(VPSRouterAdapter).inSingletonScope();
container.bind(TOKENS.richTextEditor).toConstant(tiptapRichTextEditor as RichTextEditor<unknown>);
container.bind(TOKENS.http).toInstance(ApiFetchHttpAdapter).inSingletonScope();
container.bind(TOKENS.account).toInstance(ApiAccountAdapter).inSingletonScope();
container.bind(TOKENS.authentication).toInstance(ApiAuthenticationAdapter).inSingletonScope();
container.bind(TOKENS.comment).toInstance(ApiCommentAdapter).inSingletonScope();
container.bind(TOKENS.thread).toInstance(ApiThreadAdapter).inSingletonScope();

container.bind(TOKENS.tracking).toInstance(MatomoTrackingAdapter).inSingletonScope();

if (!container.get(TOKENS.config).analyticsUrl) {
  container.bind(TOKENS.tracking).toInstance(StubTrackingAdapter).inSingletonScope();
}

const g: Record<string, unknown> = globalThis;
g.container = container;
g.TOKENS = TOKENS;
