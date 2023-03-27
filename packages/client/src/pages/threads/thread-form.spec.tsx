import expect from '@nilscox/expect';
import { stub, StubOf } from '@shakala/shared';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from 'react-query';
import { navigate } from 'vite-plugin-ssr/client/router';
import { afterEach, beforeEach, describe, it, vi } from 'vitest';

import { StubAuthenticationAdapter } from '../../adapters/api/authentication/stub-authentication.adapter';
import { StubThreadAdapter } from '../../adapters/api/thread/stub-thread.adapter';
import { di } from '../../di';
import { ValidationErrors } from '../../utils/validation-errors';

import { ThreadForm } from './thread-form';

vi.mock('vite-plugin-ssr/client/router', () => ({
  navigate: stub(),
}));

describe('ThreadForm', () => {
  const fields = {
    description: () => screen.getByLabelText('Description'),
    keywords: () => screen.getByLabelText('Mots-clés'),
    text: () => screen.getByLabelText('Texte'),
    submit: () => screen.getByRole('button', { name: 'Créer' }),
  };

  const authenticationAdapter = new StubAuthenticationAdapter();
  const threadAdapter = new StubThreadAdapter();

  beforeEach(() => {
    Object.assign(di, {
      authentication: authenticationAdapter,
      thread: threadAdapter,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('fills and submits the form', async () => {
    threadAdapter.createThread.resolve('threadId');

    const queryClient = new QueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <ThreadForm />
      </QueryClientProvider>
    );

    await user.type(fields.description(), 'description');
    await user.type(fields.keywords(), 'key words');
    await user.type(fields.text(), 'text');
    await user.click(fields.submit());

    await waitFor(() => {
      expect(navigate as StubOf<typeof navigate>).calledWith('/discussions/threadId');
    });
  });

  it('displays the field errors', async () => {
    threadAdapter.createThread.reject(
      new ValidationErrors({
        description: 'min',
        keywords: 'max',
        text: 'min',
      })
    );

    const queryClient = new QueryClient();
    const user = userEvent.setup();

    render(
      <QueryClientProvider client={queryClient}>
        <ThreadForm />
      </QueryClientProvider>
    );

    await user.type(fields.description(), 'description');
    await user.type(fields.keywords(), 'key words');
    await user.type(fields.text(), 'text');
    await user.click(fields.submit());

    await waitFor(() => {
      expect(fields.description()).toHaveErrorMessage('La description est trop courte');
      expect(fields.keywords()).toHaveErrorMessage('Un des mots-clés est trop long');
      expect(fields.text()).toHaveErrorMessage('Le texte est trop court');
    });
  });
});
