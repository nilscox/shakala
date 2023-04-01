import path from 'node:path';
import url from 'node:url';

import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { RequestHandler } from 'express';
import proxy from 'express-http-proxy';
import { QueryClient } from 'react-query';
import { renderPage } from 'vite-plugin-ssr';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const { NODE_ENV, HOST = '0.0.0.0', PORT = '8000' } = process.env;

const prod = NODE_ENV === 'production';
const root = path.resolve(__dirname, '..');

main().catch(console.error);

async function main() {
  const app = express();

  app.use('/api', proxy('http://localhost:3000'));

  app.use(
    '/user/:userId/profile-image',
    proxy('http://localhost:3000', { proxyReqPathResolver: (req) => req.originalUrl })
  );

  app.use(compression());
  app.use(cookieParser());

  if (prod) {
    app.use(express.static(path.join(root, 'dist', 'client')));
  } else {
    const vite = await import('vite');

    const viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true },
      build: { sourcemap: true },
    });

    app.use(viteDevServer.middlewares);
  }

  app.get(/.*/, handleRequest);

  app.listen(Number(PORT), HOST, () => {
    console.log(`Server started on ${HOST}:${PORT}`);
  });
}

type PageContextAdded = {
  redirectTo?: string;
};

type PageContextInit = {
  urlOriginal: string;
  token?: string;
  queryClient: QueryClient;
};

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const handleRequest: RequestHandler = async (req, res, next) => {
  const queryClient = new QueryClient();

  const { httpResponse, redirectTo } = await renderPage<PageContextAdded, PageContextInit>({
    urlOriginal: req.originalUrl,
    token: req.cookies.token,
    queryClient,
  });

  if (redirectTo) {
    return res.redirect(307, redirectTo);
  }

  if (!httpResponse) {
    return next();
  }

  const { body, statusCode, contentType, earlyHints } = httpResponse;

  res.writeEarlyHints?.({
    link: earlyHints.map((e) => e.earlyHintLink),
  });

  res.status(statusCode).type(contentType).send(body);
};
