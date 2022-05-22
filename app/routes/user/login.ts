import { ActionFunction } from '@remix-run/node';

import container from '~/inversify.config.server';
import { AuthenticationController } from '~/server/authentication/authentication.controller';
import { notFound } from '~/server/utils/responses.server';

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== 'POST') {
    return notFound();
  }

  return container.get(AuthenticationController).login(request);
};
