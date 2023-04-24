import { Suspense } from 'react';

import { MatomoScript } from '~/adapters/tracking/matomo-tracking.adapter';
import { useTrackPageViews } from '~/hooks/tracking';
import { AuthenticationModal } from '~/modules/authentication/authentication-modal';

import { PageTitle } from '../page-title';

import { Footer } from './footer';
import { Header } from './header';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <>
    <PageTitle />

    <Header className="mx-auto max-w-6" />

    <Suspense>
      <main className="mx-auto min-h-3 max-w-6 px-2 sm:px-4">{children}</main>
    </Suspense>

    <Footer className="mx-auto max-w-6" />

    <AuthenticationModal />
    <MatomoScript />
    <TrackPageViews />
  </>
);

const TrackPageViews = () => {
  useTrackPageViews();
  return null;
};
