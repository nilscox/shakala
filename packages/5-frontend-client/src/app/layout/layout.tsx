import { AppState, notificationActions } from '@shakala/frontend-domain';
import { useEffect } from 'react';

import { AuthenticationModal } from '~/app/authentication/authentication-modal';
import { PageTitle } from '~/app/page-title/page-title';
import { SnackbarProvider } from '~/elements/snackbar';
import { useAppDispatch } from '~/hooks/use-app-dispatch';
import { useUser } from '~/hooks/use-user';
import { getPublicConfig } from '~/utils/config';
import { ConfigProvider } from '~/utils/config-provider';
import { ReduxProvider } from '~/utils/redux-provider';

import { AnalyticsProvider } from '../../utils/analytics-provider';

import { Footer } from './footer';
import { Header } from './header';

type LayoutProps = {
  preloadedState: AppState;
  children: React.ReactNode;
};

export const Layout = ({ preloadedState, children }: LayoutProps) => (
  <ConfigProvider config={getPublicConfig()}>
    <AnalyticsProvider>
      <SnackbarProvider>
        <ReduxProvider preloadedState={preloadedState}>
          <PageTitle />
          <PollNotificationsCount />
          <AuthenticationModal />
          <Header className="mx-auto max-w-6" />
          <main className="mx-auto min-h-3 max-w-6 px-2 sm:px-4">{children}</main>
          <Footer className="mx-auto max-w-6" />
        </ReduxProvider>
      </SnackbarProvider>
    </AnalyticsProvider>
  </ConfigProvider>
);

const PollNotificationsCount = () => {
  const dispatch = useAppDispatch();
  const user = useUser();

  useEffect(() => {
    if (user) {
      return dispatch(notificationActions.pollNotificationsCount());
    }
  }, [dispatch, user]);

  return null;
};
