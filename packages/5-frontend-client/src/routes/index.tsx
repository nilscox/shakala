import { Outlet, Route, Routes as RRRoutes } from 'react-router-dom';

import { Layout } from '~/components/layout/layout';

import { Home } from './home';
import { Profile } from './profile';
import { ThreadsRoute } from './thread';
import { ThreadRoute } from './thread/thread-route';

export const Routes = () => (
  <RRRoutes>
    <Route path="/" element={<RouteLayout />}>
      <Route index element={<Home />} />
      <Route path="profile" element={<Profile />} />
      <Route path="discussions">
        <Route path=":threadId" element={<ThreadRoute />} />
        <Route index element={<ThreadsRoute />} />
      </Route>
    </Route>
  </RRRoutes>
);

const RouteLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);
