import { createNormalizer, NormalizationSelectors } from '@nilscox/redux-kooltik';
import { schema } from 'normalizr';

import { Comment, NormalizedComment } from './modules/comment';
import { NormalizedThread, Thread } from './modules/thread';
import { NormalizedUser, User } from './modules/user';
import { AppState } from './store';

export const userSchema = new schema.Entity('user');

export const normalizeUsers = createNormalizer.many<User, NormalizedUser>('user', userSchema);

export const commentSchema = new schema.Entity('comment', {
  author: userSchema,
});

export const normalizeComment = createNormalizer<Comment, NormalizedComment>('comment', commentSchema);
export const normalizeComments = createNormalizer.many<Comment, NormalizedComment>('comment', commentSchema);

commentSchema.define({ replies: [commentSchema] });

export const threadSchema = new schema.Entity('thread', {
  author: userSchema,
  comments: [commentSchema],
});

export const normalizeThread = createNormalizer<Thread, NormalizedThread>('thread', threadSchema);
export const normalizeThreads = createNormalizer.many<Thread, NormalizedThread>('thread', threadSchema);

export const normalizationSelectors = new NormalizationSelectors<AppState>((state: AppState) => ({
  comment: state.comment.entities,
  thread: state.thread.entities,
  user: state.user.entities,
}));
