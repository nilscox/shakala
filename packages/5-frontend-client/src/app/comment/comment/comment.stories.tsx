import {
  commentActions,
  createAuthUser,
  createComment,
  createDate,
  createReply,
  createUser,
  userProfileActions,
} from '@shakala/frontend-domain';
import { randomId } from '@shakala/shared';
import { Meta } from '@storybook/react';

import { maxWidthDecorator, reduxDecorator, ReduxStory } from '~/utils/storybook';

import { Comment } from './comment';

export default {
  title: 'Domain/Comment',
  decorators: [maxWidthDecorator(), reduxDecorator()],
} as Meta;

export const comment: ReduxStory = () => {
  return <Comment commentId={commentFixture.id} />;
};

comment.args = {
  setup(dispatch, getState, { commentGateway }) {
    dispatch(userProfileActions.setAuthenticatedUser(createAuthUser({ nick: 'Storybook' })));
    dispatch(commentActions.addComments([commentFixture]));

    commentGateway.setReaction.resolve(undefined, 1000);
    commentGateway.editComment.resolve(undefined, 1000);
    commentGateway.createReply.resolve(randomId(), 1000);
  },
};

// cspell:word bopzor lemonde wikipedia

const commentFixture = createComment({
  author: createUser({ nick: 'Bopzor' }),
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
    createReply({
      author: createUser({ nick: 'nilscox' }),
      date: createDate('2022-06-14'),
      text: "Bien vu, merci pour le lien vers l'article. Notons tout de même que [selon lemonde](https://www.lemonde.fr/pixels/article/2017/02/09/le-daily-mail-n-est-plus-une-source-utilisable-sur-wikipedia_5077027_4408996.html), wikipedia ne fait plus confiance au DailyMail depuis 2017 !",
      upvotes: 6,
      downvotes: 2,
    }),
  ],
});
