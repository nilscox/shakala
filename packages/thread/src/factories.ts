import { EntityFactory, randomId, Timestamp, ValueObjectFactory } from '@shakala/common';

import { Comment } from './entities/comment.entity';
import { Markdown } from './entities/markdown.value-object';
import { Message } from './entities/message.entity';
import { Reaction, ReactionType } from './entities/reaction.entity';

type Factories = {
  markdown: ValueObjectFactory<Markdown>;
  message: EntityFactory<Message>;
  comment: EntityFactory<Comment>;
  reaction: EntityFactory<Reaction>;
};

export const create: Factories = {
  markdown(value = '') {
    return new Markdown(value);
  },

  message(props) {
    return new Message({
      id: randomId(),
      authorId: '',
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
};
