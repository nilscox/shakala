import 'reflect-metadata';
import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import Container from 'typedi';

import { InMemoryThreadRepository, ThreadRepositoryToken } from './data/thread.repository';
import { threadFacebookZetetique } from './thread-facebook-zetetique';

Container.set(ThreadRepositoryToken, new InMemoryThreadRepository([threadFacebookZetetique]));

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = renderToString(<RemixServer context={remixContext} url={request.url} />);

  responseHeaders.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
