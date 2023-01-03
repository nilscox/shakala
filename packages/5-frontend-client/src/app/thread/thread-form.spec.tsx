import { createAuthUser, threadSelectors, ValidationErrors } from '@shakala/frontend-domain';
import { TestStore, createTestStore } from '@shakala/frontend-domain/test';
import { screen, waitFor } from '@testing-library/react';

import { createTestRenderer, TestRenderer } from '~/utils/test-renderer';

import { ThreadForm } from './thread-form';

describe('ThreadForm', () => {
  let store: TestStore;
  let render: TestRenderer;

  beforeEach(() => {
    store = createTestStore();
    render = createTestRenderer().withStore(store);

    store.user = createAuthUser();
  });

  const fields = {
    description: () => screen.getByLabelText('Description'),
    keywords: () => screen.getByLabelText('Mots-clés'),
    text: () => screen.getByLabelText('Texte'),
    submit: () => screen.getByRole('button', { name: 'Créer' }),
  };

  it('fills and submits the form', async () => {
    store.threadGateway.createThread.resolve('threadId');

    const user = render(<ThreadForm />);

    await user.type(fields.description(), 'description');
    await user.type(fields.keywords(), 'key words');
    await user.type(fields.text(), 'text');
    await user.click(fields.submit());

    await waitFor(() => {
      expect(store.select(threadSelectors.byId, 'threadId')).toEqual(
        expect.objectWith({
          id: 'threadId',
          description: 'description',
          keywords: ['key', 'words'],
          text: 'text',
        }),
      );
    });
  });

  it('displays the field errors', async () => {
    store.threadGateway.createThread.reject(
      new ValidationErrors({
        description: { value: '', error: 'min' },
        'keywords[1]': { value: '', error: 'max' },
        text: { value: '', error: 'min' },
      }),
    );

    const user = render(<ThreadForm />);

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
