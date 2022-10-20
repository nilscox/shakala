import { Outlet, Route, Routes as RRRoutes } from 'react-router-dom';

import { Layout } from '~/components/layout/layout';

import { CharterRoute } from './charter';
import { FaqRoute } from './faq';
import { Home } from './home';
import { MarkdownCheatsheetRoute } from './markdown-cheatsheet';
import { MotivationsRoute } from './motivations';
import { NotFoundRoute } from './not-found';
import { BadgesRoute } from './profile/badges';
import { DraftsRoute } from './profile/drafts';
import { ProfileLayout } from './profile/layout';
import { NotificationsRoute } from './profile/notifications';
import { ProfileRoute } from './profile/profile';
import { ReputationRoute } from './profile/reputation';
import { TimelineRoute } from './profile/timeline';
import { ThreadsRoute } from './thread';
import { ThreadRoute } from './thread/thread-route';

export const Routes = () => (
  <RRRoutes>
    <Route path="/" element={<RouteLayout />}>
      <Route index element={<Home />} />

      <Route path="profil" element={<ProfileLayout />}>
        <Route path="" element={<ProfileRoute />} />
        <Route path="notifications" element={<NotificationsRoute />} />
        <Route path="badges" element={<BadgesRoute />} />
        <Route path="reputation" element={<ReputationRoute />} />
        <Route path="brouillons" element={<DraftsRoute />} />
        <Route path="timeline" element={<TimelineRoute />} />
      </Route>

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
