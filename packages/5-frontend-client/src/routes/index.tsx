import { Outlet, Route, Routes as RRRoutes } from 'react-router-dom';

import { Layout } from '~/components/layout/layout';

import { CharterRoute } from './charter';
import { FaqRoute } from './faq';
import { Home } from './home';
import { MarkdownCheatsheetRoute } from './markdown-cheatsheet';
import { MotivationsRoute } from './motivations';
import { NotFoundRoute } from './not-found';
import { Profile } from './profile';
import { ThreadsRoute } from './thread';
import { ThreadRoute } from './thread/thread-route';

export const Routes = () => (
  <RRRoutes>
    <Route path="/" element={<RouteLayout />}>
      <Route index element={<Home />} />
      <Route path="profil" element={<Profile />} />
      <Route path="charte" element={<CharterRoute />} />
      <Route path="faq" element={<FaqRoute />} />
      <Route path="motivations" element={<MotivationsRoute />} />
      <Route path="mise-en-forme" element={<MarkdownCheatsheetRoute />} />
      <Route path="discussions">
        <Route path=":threadId" element={<ThreadRoute />} />
        <Route index element={<ThreadsRoute />} />
      </Route>
      <Route path="*" element={<NotFoundRoute />} />
    </Route>
  </RRRoutes>
);

const RouteLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);
