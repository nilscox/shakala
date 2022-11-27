import { AppThunk } from '../../../store';
import { ValidationErrors } from '../../../utils/validation-error';
import { authenticationActions } from '../../authentication';
import { handleAuthorizationError } from '../../authorization';
import { routerActions } from '../../router';
import { threadActions } from '../thread.actions';
import { Thread, ThreadForm } from '../thread.types';

export const createThread = (form: ThreadForm): AppThunk => {
  return async (dispatch, getState, { threadGateway, dateGateway, snackbarGateway, loggerGateway }) => {
    const user = dispatch(authenticationActions.requireAuthentication());

    if (!user) {
      return;
    }

    const description = form.description.trim();
    const text = form.text.trim();

    const keywords = form.keywords
      .split(' ')
      .map((keyword) => keyword.trim())
      .filter(Boolean);

    try {
      const threadId = await threadGateway.createThread(description, keywords, text);

      const thread: Thread = {
        id: threadId,
        author: {
          id: user.id,
          nick: user.nick,
          profileImage: user.profileImage,
        },
        date: dateGateway.nowAsString(),
        description,
        keywords,
        text,
        comments: [],
      };

      dispatch(threadActions.addLastThread(thread));

      dispatch(routerActions.setPathname(`/discussions/${thread.id}`));

      snackbarGateway.success('Votre fil de discussion a bien été créé.');
    } catch (error) {
      if (error instanceof ValidationErrors) {
        throw error.withFieldMapper((field) => {
          if (field.startsWith('keywords')) {
            return 'keywords';
          }
        });
      }

      if (!dispatch(handleAuthorizationError(error, 'créer un nouveau fil de discussion'))) {
        loggerGateway.error(error);
        snackbarGateway.error("Une erreur s'est produite, votre fil de discussion n'a pas été créé.");
      }
    }
  };
};
