import { Meta } from '@storybook/react';
import { createUserActivity, userActivityActions } from 'frontend-domain';
import { AuthenticationMethod, ReactionTypeDto, UserActivityType } from 'shared';

import { reduxDecorator, ReduxStory } from '~/utils/storybook';

import { UserActivities } from './user-activities';

export default {
  title: 'Domain/UserActivities',
  decorators: [reduxDecorator()],
} as Meta;

export const userActivities: ReduxStory = () => <UserActivities />;

userActivities.args = {
  setup(dispatch) {
    dispatch(userActivityActions.addMany(activities));
  },
};

const authorId = 'authorId';
const threadId = 'threadId';
const threadDescription = 'Que penser du bio-compensateur géodésique ?';
const commentId = 'commentId';
const commentText = 'commentText';

const randInt = (max: number) => {
  return Math.floor(Math.random() * max)
    .toString()
    .padStart(2, '0');
};

let day = 1;
const date = () => {
  const str = `2022-02-${(day++).toString().padStart(2, '0')}T${randInt(24)}:${randInt(60)}`;
  return new Date(str).toISOString();
};

const activities = [
  createUserActivity({
    type: UserActivityType.signUp,
    date: date(),
  }),
  createUserActivity({
    type: UserActivityType.emailAddressValidated,
    date: date(),
  }),
  createUserActivity({
    type: UserActivityType.signOut,
    date: date(),
  }),
  createUserActivity({
    type: UserActivityType.signIn,
    date: date(),
    payload: { method: AuthenticationMethod.emailPassword },
  }),
  createUserActivity({
    type: UserActivityType.profileImageChanged,
    date: date(),
    payload: { image: '' },
  }),
  createUserActivity({
    type: UserActivityType.threadCreated,
    date: date(),
    payload: { threadId, authorId, description: threadDescription, text: '' },
  }),
  createUserActivity({
    type: UserActivityType.rootCommentCreated,
    date: date(),
    payload: { threadId, threadDescription, commentId, commentText },
  }),
  createUserActivity({
    type: UserActivityType.replyCreated,
    date: date(),
    payload: { threadId, threadDescription, commentId, commentText, parentId: 'parentId' },
  }),
  createUserActivity({
    type: UserActivityType.commentEdited,
    date: date(),
    payload: { threadId, threadDescription, commentId, commentText },
  }),
  createUserActivity({
    type: UserActivityType.commentReactionSet,
    date: date(),
    payload: {
      threadId,
      threadDescription,
      commentId,
      commentText,
      userId: 'userId',
      reaction: ReactionTypeDto.upvote,
    },
  }),
  createUserActivity({
    type: UserActivityType.commentReported,
    date: date(),
    payload: { threadId, threadDescription, commentId, commentText },
  }),
].reverse();
