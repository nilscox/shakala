import { ThreadGateway } from '../gateways/thread-gateway';
import { createStubFunction } from '../utils/create-stub-function';

export class StubThreadGateway implements ThreadGateway {
  fetchLast = createStubFunction<ThreadGateway['fetchLast']>();
  fetchThread = createStubFunction<ThreadGateway['fetchThread']>();
  fetchComments = createStubFunction<ThreadGateway['fetchComments']>();
  createThread = createStubFunction<ThreadGateway['createThread']>();
  createComment = createStubFunction<ThreadGateway['createComment']>();
}
