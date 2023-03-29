import { createAuthorDto, createCommentDto, createReplyDto, ReactionType } from '@shakala/shared';
import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';

import { createDate } from '~/utils/date-utils';
import { configureStory, maxWidthDecorator } from '~/utils/storybook';

import { Comment } from './comment';

export default {
  title: 'Domain/Comment',
  parameters: {
    pageContext: {
      urlPathname: '/',
      routeParams: { threadId: 'threadId' },
    },
  },
  decorators: [maxWidthDecorator],
} satisfies Meta;

export const comment: StoryFn = () => {
  return <Comment comment={commentFixture} />;
};

comment.decorators = [
  configureStory((adapters) => {
    adapters.comment.createReply.implement(async (parentId, text) => {
      const reply = createReplyDto({
        author: createAuthorDto({ nick: 'You' }),
        date: new Date().toISOString(),
        text,
        isSubscribed: true,
      });

      commentFixture.replies.push(reply);

      action('createReply')(parentId, text);

      return reply.id;
    });

    adapters.comment.editComment.implement(async (commentId, text) => {
      const now = new Date().toISOString();

      commentFixture.history.push({ date: now, text: commentFixture.text });
      commentFixture.edited = now;
      commentFixture.text = text;

      action('editComment')(commentId, text);
    });

    adapters.comment.setReaction.implement(async (commentId, reactionType) => {
      commentFixture.upvotes = 61;
      commentFixture.downvotes = 25;

      if (commentFixture.userReaction === reactionType) {
        delete commentFixture.userReaction;
        action('setReaction')(commentId, undefined);
        return;
      }

      commentFixture.userReaction = reactionType ?? undefined;

      if (reactionType === ReactionType.upvote) {
        commentFixture.upvotes++;
      }

      if (reactionType === ReactionType.downvote) {
        commentFixture.downvotes++;
      }

      action('setReaction')(commentId, reactionType);
    });

    adapters.comment.setSubscription.implement(async (commentId, subscribed) => {
      commentFixture.isSubscribed = subscribed;
      action('setSubscription')(commentId, subscribed);
    });

    adapters.comment.reportComment.implement(async (commentId, reason) => {
      action('reportComment')(commentId, reason);
    });
  }),
];

// cspell:word bopzor lemonde wikipedia
const commentFixture = createCommentDto({
  id: 'commentId',
  author: createAuthorDto({ nick: 'Bopzor' }),
  text: `De ce que j'en comprends, l'objectif de cet article^85 est de dire que la balance bénéfice/risque du vaccin COVID-19 Pfizer/BioNTech est à réévaluer (vers plus de risque).

L'élément mis en avant ici me semble^95 être le témoignage de l'épouse d'un homme décédé 16 jours après la première injection.
J'ai pu retrouver l'article original (en anglais) sur le [DailyMail.com](https://www.dailymail.co.uk/news/article-9119431/Miami-doctor-58-dies-three-weeks-receiving-Pfizer-Covid-19-vaccine.html), où l'on retrouve bien les éléments cités et traduits par FranceSoir.

On peut lire que l'épouse
> "déclare qu'elle est certaine que sa mort a été déclenchée par le vaccin",

ainsi que :
> Mère d'un enfant, elle a aussi déclaré: « Dans mon esprit, sa mort était à 100% liée au vaccin. Il n'y a pas d'autre explication. »

Mais un témoignage n'est certainement pas une preuve !
En plus, il est indiqué que l'enquête est en cours, il est donc, de toute façon, trop tôt pour tirer des conclusions sur le lien entre la mort et le vaccin.

Rien ne me permet de dire que la balance bénéfice/risque en est affectée. Prudence donc, avec ce qu'on lit sur FranceSoir !`,
  date: createDate('2022-06-12'),
  upvotes: 61,
  downvotes: 25,
  replies: [
    createReplyDto({
      id: 'replyId',
      author: createAuthorDto({ nick: 'nilscox' }),
      date: createDate('2022-06-14'),
      text: "Bien vu, merci pour le lien vers l'article. Notons tout de même que [selon lemonde](https://www.lemonde.fr/pixels/article/2017/02/09/le-daily-mail-n-est-plus-une-source-utilisable-sur-wikipedia_5077027_4408996.html), wikipedia ne fait plus confiance au DailyMail depuis 2017 !",
      upvotes: 6,
      downvotes: 2,
    }),
  ],
});
