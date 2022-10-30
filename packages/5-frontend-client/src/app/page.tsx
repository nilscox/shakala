import { setLastThreads, setThreads } from 'frontend-domain';
import { headers } from 'next/headers';
import { getIds } from 'shared';

import { api } from '../adapters';

import { Dispatch } from './dispatch';
import { Home } from './home';

export default async function HomePage() {
  const { threadGateway } = await api(headers().get('Cookies'));
  const lastThreads = await threadGateway.getLast(3);

  return (
    <>
      <Dispatch actions={[setThreads(lastThreads), setLastThreads(getIds(lastThreads))]} />
      <Home />
    </>
  );
}
