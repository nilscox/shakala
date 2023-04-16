import { createUserActivityDto, ReactionType, UserActivityType } from '@shakala/shared';
import { Meta, StoryFn } from '@storybook/react';
import { stub } from 'sinon';

import { UserActivities } from './user-activities';

// cspell:word tizote

export default {
  title: 'Domain/UserActivities',
} satisfies Meta;

export const userActivities: StoryFn = () => (
  <UserActivities activities={activities} hasMore={false} loadMore={stub()} loading={false} />
);

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
  createUserActivityDto({
    type: UserActivityType.signUp,
    date: date(),
  }),
  createUserActivityDto({
    type: UserActivityType.emailAddressValidated,
    date: date(),
  }),
  createUserActivityDto({
    type: UserActivityType.signOut,
    date: date(),
  }),
  createUserActivityDto({
    type: UserActivityType.signIn,
    date: date(),
  }),
  createUserActivityDto({
    type: UserActivityType.nickChanged,
    date: date(),
    payload: {
      oldValue: 'Biloute',
      newValue: 'Tizote',
    },
  }),
  createUserActivityDto({
    type: UserActivityType.threadCreated,
    date: date(),
    payload: { threadId, description: threadDescription, text: '' },
  }),
  createUserActivityDto({
    type: UserActivityType.rootCommentCreated,
    date: date(),
    payload: { threadId, threadDescription, commentId, commentText },
  }),
  createUserActivityDto({
    type: UserActivityType.replyCreated,
    date: date(),
    payload: { threadId, threadDescription, commentId, commentText, parentId: 'parentId' },
  }),
  createUserActivityDto({
    type: UserActivityType.commentEdited,
    date: date(),
    payload: { threadId, threadDescription, commentId, commentText },
  }),
  createUserActivityDto({
    type: UserActivityType.commentReactionSet,
    date: date(),
    payload: { threadId, threadDescription, commentId, commentText, reaction: ReactionType.upvote },
  }),
  createUserActivityDto({
    type: UserActivityType.commentReactionSet,
    date: date(),
    payload: { threadId, threadDescription, commentId, commentText, reaction: ReactionType.downvote },
  }),
  createUserActivityDto({
    type: UserActivityType.commentReported,
    date: date(),
    payload: { threadId, threadDescription, commentId, commentText },
  }),
].reverse();
