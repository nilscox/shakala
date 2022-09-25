import { schema } from 'normalizr';

import { State } from './store.types';

export const userSchema = new schema.Entity('user');

export const commentSchema = new schema.Entity('comment', {
  author: userSchema,
});

commentSchema.define({ replies: [commentSchema] });

export const threadSchema = new schema.Entity('thread', {
  author: userSchema,
  comments: [commentSchema],
});

export const schemas = {
  user: userSchema,
  comment: commentSchema,
  thread: threadSchema,
};

export const selectNormalizedEntities = (state: State) => ({
  user: state.users,
  comment: state.comments.entities,
  thread: state.threads.entities,
});
