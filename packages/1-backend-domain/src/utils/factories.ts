import { Factory, randomId } from 'shared';

import { Entity, EntityProps } from '../ddd/entity';
import { ValueObject } from '../ddd/value-object';
import { DomainDependencies } from '../domain-dependencies';
import { Author } from '../entities/author.entity';
import { CommentReport } from '../entities/comment-report.entity';
import { Comment } from '../entities/comment.entity';
import { Markdown } from '../entities/markdown.value-object';
import { Message } from '../entities/message.entity';
import { Nick } from '../entities/nick.value-object';
import { ProfileImage, ProfileImageData, ProfileImageType } from '../entities/profile-image.value-object';
import { Reaction, ReactionsCount, ReactionType } from '../entities/reaction.entity';
import { Thread } from '../entities/thread.entity';
import { Timestamp } from '../entities/timestamp.value-object';
import { User } from '../entities/user.entity';

import { StubCryptoAdapter } from './stub-crypto.adapter';
import { StubDateAdapter } from './stub-date.adapter';
import { StubGeneratorAdapter } from './stub-generator.adapter';
import { StubProfileImageStoreAdapter } from './stub-profile-image-store.adapter';

type ValueObjectFactory<VO extends ValueObject<unknown>> = VO extends ValueObject<infer V>
  ? Factory<VO, Partial<V>>
  : never;

type EntityFactory<E extends Entity<EntityProps>> = E extends Entity<infer P>
  ? Factory<E, Partial<P>>
  : never;

type Factories = {
  id(): string;

  markdown: ValueObjectFactory<Markdown>;
  nick: ValueObjectFactory<Nick>;
  profileImage: ValueObjectFactory<ProfileImage>;
  profileImageData: ValueObjectFactory<ProfileImageData>;
  timestamp: ValueObjectFactory<Timestamp>;

  author: EntityFactory<Author>;
  comment: EntityFactory<Comment>;
  commentReport: EntityFactory<CommentReport>;
  message: EntityFactory<Message>;
  reaction: EntityFactory<Reaction>;
  thread: EntityFactory<Thread>;
  user: EntityFactory<User>;

  reactionsCount: Factory<ReactionsCount>;
};

export const createDomainDependencies: Factory<DomainDependencies> = (overrides) => ({
  generator: new StubGeneratorAdapter(),
  date: new StubDateAdapter(),
  crypto: new StubCryptoAdapter(),
  profileImageStore: new StubProfileImageStoreAdapter(),
  ...overrides,
});

export const factories: Factory<Factories, Partial<DomainDependencies>> = (overrides) => {
  const deps = createDomainDependencies(overrides);

  return {
    id: randomId,

    markdown(text = '') {
      return new Markdown(text);
    },

    nick(nick = 'nick') {
      return new Nick(nick);
    },

    profileImage(path = '') {
      return new ProfileImage(path);
    },

    profileImageData(overrides) {
      return new ProfileImageData({
        type: ProfileImageType.png,
        data: Buffer.from(''),
        ...overrides,
      });
    },

    timestamp(date = '2000-01-01') {
      return new Timestamp(date);
    },

    author(props) {
      if (props instanceof User) {
        return new Author(props);
      }

      return new Author({
        id: this.id(),
        nick: this.nick(),
        profileImage: this.profileImage(),
        ...props,
      });
    },

    comment(props) {
      return new Comment(
        {
          id: this.id(),
          threadId: '',
          author: this.author(),
          parentId: null,
          message: this.message({ author: props?.author }),
          history: [],
          ...props,
        },
        deps.generator,
        deps.date,
      );
    },

    commentReport(props) {
      return new CommentReport({
        id: this.id(),
        commentId: '',
        reportedBy: this.user(),
        reason: null,
        ...props,
      });
    },

    message(props) {
      return new Message({
        id: this.id(),
        date: this.timestamp(),
        author: this.author(),
        text: this.markdown(),
        ...props,
      });
    },

    reaction(props) {
      return new Reaction({
        id: this.id(),
        commentId: this.id(),
        userId: this.id(),
        type: ReactionType.upvote,
        ...props,
      });
    },

    thread(props) {
      return new Thread({
        id: this.id(),
        author: this.author(),
        description: '',
        text: this.markdown(),
        keywords: [],
        created: this.timestamp(),
        ...props,
      });
    },

    user(props) {
      return new User(
        {
          id: this.id(),
          email: '',
          hashedPassword: '',
          nick: this.nick(),
          profileImage: null,
          signupDate: this.timestamp(),
          lastLoginDate: null,
          emailValidationToken: null,
          hasWriteAccess: true,
          ...props,
        },
        deps.generator,
        deps.date,
        deps.crypto,
        deps.profileImageStore,
      );
    },

    reactionsCount(props) {
      return {
        [ReactionType.upvote]: 0,
        [ReactionType.downvote]: 0,
        ...props,
      };
    },
  };
};
