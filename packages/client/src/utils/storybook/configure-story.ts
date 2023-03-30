import { Decorator } from '@storybook/react';
import { useInjection } from 'brandi-react';
import { useQueryClient } from 'react-query';

import { StubAuthenticationAdapter } from '~/adapters/api/authentication/stub-authentication.adapter';
import { StubCommentAdapter } from '~/adapters/api/comment/stub-comment.adapter';
import { StubThreadAdapter } from '~/adapters/api/thread/stub-thread.adapter';
import { TOKENS } from '~/app/tokens';

type StubApiAdapters = {
  authentication: StubAuthenticationAdapter;
  thread: StubThreadAdapter;
  comment: StubCommentAdapter;
};

type ConfigureStory<Args> = (adapters: StubApiAdapters, args: Args) => unknown;

export const configureStory = <Args extends object>(configure: ConfigureStory<Args>): Decorator<Args> => {
  // eslint-disable-next-line react/display-name
  return (Story, { args }) => {
    const adapters = {
      authentication: useInjection(TOKENS.authentication),
      thread: useInjection(TOKENS.thread),
      comment: useInjection(TOKENS.comment),
    } as StubApiAdapters;

    const queryClient = useQueryClient();
    const getUserQueryKey = [adapters.authentication.constructor.name, 'getAuthenticatedUser', []];

    if ('authenticated' in args) {
      // todo: not working?
      if (args.authenticated) {
        queryClient.setQueryData(getUserQueryKey, { id: 'userId', nick: 'Myself' });
      } else {
        queryClient.setQueryData(getUserQueryKey, undefined);
      }
    }

    configure(adapters, args);

    return Story();
  };
};
