import classNames from 'classnames';

import { User } from '~/types';

import { AuthenticationModal } from '../domain/authentication/authentication-modal';

import { Footer } from './footer';
import { Header } from './header';

const width = 'max-w-[1100px]';

type LayoutProps = {
  user?: User;
  children: React.ReactNode;
};

export const Layout = ({ user, children }: LayoutProps) => (
  <>
    <Header user={user} className={classNames(width, 'mx-auto')} />

    <main className={classNames(width, 'mx-auto min-h-[520px]')}>
      <div className="mx-4">{children}</div>
    </main>

    <Footer className={classNames(width, 'mx-auto')} />

    <AuthenticationModal />
  </>
);
