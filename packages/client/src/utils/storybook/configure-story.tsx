import { Decorator } from '@storybook/react';
import { useInjection } from 'brandi-react';

import { StubAuthenticationAdapter } from '~/adapters/api/authentication/stub-authentication.adapter';
import { StubCommentAdapter } from '~/adapters/api/comment/stub-comment.adapter';
import { StubThreadAdapter } from '~/adapters/api/thread/stub-thread.adapter';
import { TOKENS } from '~/app/tokens';

type StubApiAdapters = {
  authentication: StubAuthenticationAdapter;
  thread: StubThreadAdapter;
  comment: StubCommentAdapter;
};

type ConfigureStory = (adapters: StubApiAdapters) => unknown;

export const configureStory = (configure: ConfigureStory): Decorator => {
  // eslint-disable-next-line react/display-name
  return (Story) => {
    configure({
      authentication: useInjection(TOKENS.authentication),
      thread: useInjection(TOKENS.thread),
      comment: useInjection(TOKENS.comment),
    } as StubApiAdapters);

    return <Story />;
  };
};
