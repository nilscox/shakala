export { createComment } from './commands/create-comment/create-comment';
export { createThread } from './commands/create-thread/create-thread';
export { editComment } from './commands/edit-comment/edit-comment';
export { reportComment } from './commands/report-comment/report-comment';
export { setCommentSubscription } from './commands/set-comment-subscription/set-comment-subscription';
export { setReaction } from './commands/set-reaction/set-reaction';

export { getComment, type GetCommentResult } from './queries/get-comment';
export { getLastThreads, type GetLastThreadsResult } from './queries/get-last-threads';
export { getThread, type GetThreadResult } from './queries/get-thread';

export { ThreadModule } from './thread.module';
