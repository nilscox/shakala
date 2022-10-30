import { setThread } from 'frontend-domain';
import { headers } from 'next/headers';

import { api } from '../../../adapters';
import { Dispatch } from '../../dispatch';

import { Thread } from './thread/thread';

type ThreadPageProps = {
  params: {
    'thread-id': string;
  };
};

const ThreadPage = async ({ params }: ThreadPageProps) => {
  const threadId = params['thread-id'];

  const { threadGateway } = api(headers().get('Cookie'));
  const result = await threadGateway.getById(threadId);

  if (!result) {
    return <>not found</>;
  }

  return (
    <Dispatch action={setThread(...result)}>
      <Thread threadId={result[0].id} />
    </Dispatch>
  );
};

export default ThreadPage;
