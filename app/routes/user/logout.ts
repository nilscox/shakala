import { ActionFunction } from '@remix-run/node';

import { AuthenticationController } from '~/server/authentication/authentication.controller';
import container from '~/server/inversify.config.server';
import { notFound } from '~/server/utils/responses.server';

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return notFound();
  }

  return container.get(AuthenticationController).logout(request);
};
