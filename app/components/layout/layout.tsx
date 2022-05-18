import classNames from 'classnames';

import { AuthenticationModal } from '../domain/authentication/authentication-modal';

import { Footer } from './footer';
import { Header } from './header';

const width = 'max-w-[1100px]';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <>
    <Header className={classNames(width, 'mx-auto')} />

    <main className={classNames(width, 'mx-auto min-h-[520px]')}>
      <div className="mx-4">{children}</div>
    </main>

    <Footer className={classNames(width, 'mx-auto')} />

    <AuthenticationModal />
  </>
);
