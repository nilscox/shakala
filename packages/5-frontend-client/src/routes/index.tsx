import { Outlet, Route, Routes as RRRoutes } from 'react-router-dom';

import { Layout } from '~/components/layout/layout';

import { Home } from './home';
import { Profile } from './profile';

export const Routes = () => (
  <RRRoutes>
    <Route path="/" element={<RouteLayout />}>
      <Route index element={<Home />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  </RRRoutes>
);

const RouteLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);
