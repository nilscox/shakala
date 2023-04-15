import { EntityFactory, randomId, Timestamp, ValueObjectFactory } from '@shakala/common';

import { CommentReport } from './entities/comment-report.entity';
import { CommentSubscription } from './entities/comment-subscription.entity';
import { Comment } from './entities/comment.entity';
import { Markdown } from './entities/markdown.value-object';
import { Message } from './entities/message.entity';
import { Reaction, ReactionType } from './entities/reaction.entity';
import { Thread } from './entities/thread.entity';

type Factories = {
  thread: EntityFactory<Thread>;
  markdown: ValueObjectFactory<Markdown>;
  message: EntityFactory<Message>;
  comment: EntityFactory<Comment>;
  reaction: EntityFactory<Reaction>;
  commentReport: EntityFactory<CommentReport>;
  commentSubscription: EntityFactory<CommentSubscription>;
};

export const create: Factories = {
  thread(props) {
    return new Thread({
      id: randomId(),
      authorId: '',
      created: new Timestamp(0),
      edited: new Timestamp(0),
      keywords: [],
      description: '',
      text: create.markdown(),
      ...props,
    });
  },

  markdown(value = '') {
    return new Markdown(value);
  },

  message(props) {
    return new Message({
      id: randomId(),
      date: new Timestamp(0),
      text: this.markdown(),
      ...props,
    });
  },

  comment(props) {
    return new Comment({
      id: randomId(),
      authorId: '',
      threadId: '',
      messages: [this.message()],
      ...props,
    });
  },

  reaction(props) {
    return new Reaction({
      id: randomId(),
      commentId: '',
      userId: '',
      type: ReactionType.upvote,
      ...props,
    });
  },

  commentReport(props) {
    return new CommentReport({
      id: randomId(),
      commentId: '',
      reportedById: '',
      ...props,
    });
  },

  commentSubscription(props) {
    return new CommentSubscription({
      id: randomId(),
      commentId: '',
      userId: '',
      ...props,
    });
  },
};
