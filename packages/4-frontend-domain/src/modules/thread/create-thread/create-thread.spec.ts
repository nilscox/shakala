import { AuthorizationErrorReason } from 'shared';

import { createTestStore, TestStore } from '../../../test-store';
import { createDate } from '../../../utils/date-utils';
import { ValidationErrors } from '../../../utils/validation-error';
import { authenticationSelectors } from '../../authentication';
import { AuthorizationError } from '../../authorization';
import { routerSelectors } from '../../router';
import { AuthUser, createAuthUser } from '../../user-account';
import { threadActions } from '../thread.actions';
import { threadSelectors } from '../thread.selectors';
import { createThreadForm, Thread } from '../thread.types';

describe('createThread', () => {
  let store: TestStore;

  beforeEach(() => {
    store = createTestStore();
    store.user = createAuthUser();
    store.threadGateway.createThread.resolve('threadId');
    store.dateGateway.setNow(new Date('2022-01-01'));
  });

  const createThread = async (
    form = createThreadForm({ description: 'description', keywords: 'key word', text: 'text' }),
  ) => {
    await store.dispatch(threadActions.createThread(form));
  };

  it('creates a new thread', async () => {
    const user = store.user as AuthUser;

    await createThread();

    const expected: Thread = {
      id: 'threadId',
      author: {
        id: user.id,
        nick: user.nick,
        profileImage: user.profileImage,
      },
      date: createDate('2022-01-01'),
      description: 'description',
      keywords: ['key', 'word'],
      text: 'text',
      comments: [],
    };

    expect(store.select(threadSelectors.byId, 'threadId')).toEqual(expected);
  });

  it('trims the given form fields', async () => {
    const form = createThreadForm({
      description: ' description  ',
      keywords: ' key  word  ',
      text: ' text  ',
    });

    await createThread(form);

    const expected: Partial<Thread> = {
      description: 'description',
      keywords: ['key', 'word'],
      text: 'text',
    };

    expect(store.threadGateway.createThread.lastCall).toEqual(['description', ['key', 'word'], 'text']);
    expect(store.select(threadSelectors.byId, 'threadId')).toEqual(expect.objectWith(expected));
  });

  it('adds the thread to the last threads list', async () => {
    await createThread();

    expect(store.select(threadSelectors.lastThreads)).toHaveProperty('0.id', 'threadId');
  });

  it('requires user authentication', async () => {
    store.user = null;

    await createThread();

    expect(store.select(authenticationSelectors.isModalOpen)).toBe(true);
  });

  it('redirects to the new thread page', async () => {
    await createThread();

    expect(store.select(routerSelectors.pathname)).toEqual('/discussions/threadId');
  });

  it('shows a snack when the creation succeeded', async () => {
    await createThread();

    expect(store.snackbarGateway).toHaveSnack('success', 'Votre fil de discussion a bien été créé.');
  });

  describe('error handling', () => {
    it('shows a snack when the user is not authorized to create a thread', async () => {
      store.threadGateway.createThread.reject(
        new AuthorizationError(AuthorizationErrorReason.emailValidationRequired),
      );

      await createThread();

      expect(store.snackbarGateway).toHaveSnack(
        'error',
        expect.stringMatching(/créer un nouveau fil de discussion.$/),
      );
    });

    it('throws validation errors', async () => {
      const error = new ValidationErrors({
        description: { error: 'min', value: 'a' },
        'keywords[1]': { error: 'min', value: 'a' },
      });

      store.threadGateway.createThread.reject(error);

      await expect.rejects(createThread()).with(error);

      expect(error.getFieldError('description')).toEqual('min');
      expect(error.getFieldError('keywords')).toEqual('min');
    });

    it('logs the unhandled errors', async () => {
      const error = new Error('nope.');

      store.threadGateway.createThread.reject(error);

      await createThread();

      expect(store.loggerGateway.error).toHaveBeenCalledWith(error);
    });

    it('shows a fallback message to inform that the thread was not created', async () => {
      store.threadGateway.createThread.reject(new Error('nope.'));

      await createThread();

      expect(store.snackbarGateway).toHaveSnack(
        'error',
        "Une erreur s'est produite, votre fil de discussion n'a pas été créé.",
      );
    });
  });
});
