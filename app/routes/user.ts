import { ActionFunction, json, LoaderFunction } from '@remix-run/node';

import container from '~/inversify.config.server';
import { AuthenticationController } from '~/lib/authentication.controller';
import { SessionService, SessionServiceToken } from '~/lib/session.service';

import { badRequest, notImplemented } from '../lib/responses';

export const loader: LoaderFunction = async ({ request }) => {
  const sessionService = container.get<SessionService>(SessionServiceToken);
  const userId = await sessionService.getUserId(request);

  return json({ userId });
};

export const action: ActionFunction = async ({ request }) => {
  const sessionService = container.get<SessionService>(SessionServiceToken);
  const [user, session] = await authenticate(await request.formData());

  return json(user, {
    headers: {
      'Set-Cookie': await sessionService.saveSession(session),
    },
  });
};

const authenticate = (form: FormData) => {
  const authenticationController = container.get(AuthenticationController);
  const authenticationType = form.get('authenticationType');

  switch (authenticationType) {
    case 'login':
      return authenticationController.login(form);

    case 'signup':
      return authenticationController.signup(form);

    case 'emailLogin':
      throw notImplemented('not implemented');

    default:
      throw badRequest({ error: `invalid authenticationType "${authenticationType}"` });
  }
};
