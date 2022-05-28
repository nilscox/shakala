import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from '@remix-run/react';
import ReactModal from 'react-modal';

import reactModalStyles from './react-modal.css';
import tailwindStyles from './tailwind.css';
import { Toaster } from './toast';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,400;0,500;0,600;1,200;1,400;1,500;1,600&display=swap',
    },
    {
      rel: 'stylesheet',
      href: tailwindStyles,
    },
    {
      rel: 'stylesheet',
      href: reactModalStyles,
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Shakala',
  viewport: 'width=device-width,initial-scale=1',
});

ReactModal.setAppElement('#app');

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div id="app">
          <Outlet />
        </div>
        <Toaster />
        <DisableableScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const DisableableScrollRestoration = () => {
  const location = useLocation();
  const state = location.state as { scroll?: boolean } | undefined;

  if (state?.scroll === false) {
    window.history.replaceState({}, document.title);
    return null;
  }

  return <ScrollRestoration />;
};
