import { CommentDto, createAuthorDto, createCommentDto, createReplyDto, ReactionType } from '@shakala/shared';
import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';

import { createDate } from '~/utils/date-utils';
import { configureStory, maxWidthDecorator, rerenderStory } from '~/utils/storybook';

import { Comment } from './comment';

export default {
  title: 'Domain/Comment',
  parameters: {
    pageContext: {
      urlPathname: '/',
      routeParams: { threadId: 'threadId' },
    },
  },
  args: {
    authenticated: false,
  },
  decorators: [maxWidthDecorator],
} satisfies Meta;

// eslint-disable-next-line no-empty-pattern
export const commentStory: StoryFn = ({}) => {
  return <Comment comment={comment} />;
};

commentStory.storyName = 'Comment';

commentStory.decorators = [
  configureStory((adapters) => {
    adapters.comment.createReply.implement(async (parentId, text) => {
      const reply = createReplyDto({
        author: createAuthorDto({ nick: 'You' }),
        date: new Date().toISOString(),
        text,
        isSubscribed: true,
      });

      comment.replies.push(reply);

      action('createReply')(parentId, text);

      return reply.id;
    });

    adapters.comment.editComment.implement(async (commentId, text) => {
      const comment = getComment(commentId);
      const now = new Date().toISOString();

      comment.history.push({ date: now, text: comment.text });
      comment.edited = now;
      comment.text = text;

      action('editComment')(commentId, text);
    });

    adapters.comment.setReaction.implement(async (commentId, reactionType) => {
      const comment = getComment(commentId);

      if (comment.userReaction === ReactionType.upvote) comment.upvotes--;
      if (comment.userReaction === ReactionType.downvote) comment.downvotes--;

      if (comment.userReaction === reactionType) {
        delete comment.userReaction;
      } else {
        comment.userReaction = reactionType ?? undefined;
        if (reactionType === ReactionType.upvote) comment.upvotes++;
        if (reactionType === ReactionType.downvote) comment.downvotes++;
      }

      action('setReaction')(commentId, reactionType);
      rerenderStory();
    });

    adapters.comment.setSubscription.implement(async (commentId, subscribed) => {
      comment.isSubscribed = subscribed;
      action('setSubscription')(commentId, subscribed);
    });

    adapters.comment.reportComment.implement(async (commentId, reason) => {
      action('reportComment')(commentId, reason);
    });
  }),
];

const reply = createReplyDto({
  id: 'replyId',
  author: createAuthorDto({ nick: 'nilscox' }),
  date: createDate('2022-06-14'),
  text: `<p>Bien vu, merci pour le lien vers l'article.</p>
<p>Notons tout de même que <a href="https://www.lemonde.fr/pixels/article/2017/02/09/le-daily-mail-n-est-plus-une-source-utilisable-sur-wikipedia_5077027_4408996.html">selon lemonde</a>, wikipedia ne fait plus confiance au DailyMail depuis 2017 !</p>`,
  upvotes: 6,
  downvotes: 2,
});

// cspell:word bopzor lemonde wikipedia
const comment = createCommentDto({
  id: 'commentId',
  author: createAuthorDto({ nick: 'Bopzor' }),
  text: `<p>De ce que j'en comprends, l'objectif de cet article<sup>85</sup> est de dire que la balance bénéfice/risque du vaccin COVID-19 Pfizer/BioNTech est à réévaluer (vers plus de risque).</p>

<p>
  L'élément mis en avant ici me semble<sup>95</sup> être le témoignage de l'épouse d'un homme décédé 16 jours après la première injection.
  J'ai pu retrouver l'article original (en anglais) sur le <a href="https://www.dailymail.co.uk/news/article-9119431/Miami-doctor-58-dies-three-weeks-receiving-Pfizer-Covid-19-vaccine.html">DailyMail.com</a>, où l'on retrouve bien les éléments cités et traduits par FranceSoir.
</p>

<p>On peut lire que l'épouse</p>
<blockquote><p>déclare qu'elle est certaine que sa mort a été déclenchée par le vaccin</p></blockquote>

<p>ainsi que :</p>
<blockquote><p>Mère d'un enfant, elle a aussi déclaré: « Dans mon esprit, sa mort était à 100% liée au vaccin. Il n'y a pas d'autre explication.</p></blockquote>

<p>
  Mais un témoignage n'est certainement pas une preuve !
  En plus, il est indiqué que l'enquête est en cours, il est donc, de toute façon, trop tôt pour tirer des conclusions sur le lien entre la mort et le vaccin.
</p>

<p>Rien ne me permet de dire que la balance bénéfice/risque en est affectée. Prudence donc, avec ce qu'on lit sur FranceSoir !</p>`,
  date: createDate('2022-06-12'),
  upvotes: 61,
  downvotes: 25,
  replies: [reply],
});

const getComment = (commentId: string) => {
  return [comment, ...comment.replies].find((comment) => comment.id === commentId) as CommentDto;
};
