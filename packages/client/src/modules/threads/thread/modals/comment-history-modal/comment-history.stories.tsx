import { createAuthorDto, createCommentDto } from '@shakala/shared';
import { Meta, StoryFn } from '@storybook/react';
import { configureStory } from '~/utils/storybook';

import { CommentHistoryModal } from './comment-history-modal';

export default {
  title: 'Domain/CommentHistoryModal',
  parameters: {
    pageContext: {
      urlParsed: {
        searchOriginal: new URLSearchParams({ historique: 'commentId' }).toString(),
      },
    },
  },
  args: {
    authenticated: false,
  },
} as Meta;

export const commentHistoryModal: StoryFn = () => <CommentHistoryModal />;

commentHistoryModal.decorators = [
  configureStory((adapters) => {
    adapters.comment.getComment.resolve(comment);
  }),
];

const text1 = `De ce que j'en comprends, l'objectif de cet article^85 est de dire que la balance bénéfice/risque du vaccin COVID-19 Pfizer/BioNTech est à réévaluer (vers plus de risque).

L'élément mis en avant ici me semble^95 être le témoignage de l'épouse d'un homme décédé 16 jours après la première injection.
J'ai pu retrouvé l'article original (en anglais) sur le DailyMail.com, où l'on retrouve bien les éléments cités et traduits par FranceSoir.

On peut lire que l'épouse déclare qu'elle est certaine que sa mort a été déclenchée par le vaccin",

ainsi que :
> Mère d'un enfant, elle a aussi déclaré: « Dans mon esprit, sa mort était à 100% liée au vaccin. Il n'y a pas d'autre explication. »

Mais un témoignage n'est certainement pas une preuve !`;

const text2 = `De ce que j'en comprends, l'objectif de cet article^85 est de dire que la balance bénéfice/risque du vaccin COVID-19 Pfizer/BioNTech est à réévaluer (vers plus de risque).

L'élément mis en avant ici me semble^95 être le témoignage de l'épouse d'un homme décédé 16 jours après la première injection.
J'ai pu retrouver l'article original (en anglais) sur le DailyMail.com, où l'on retrouve bien les éléments cités et traduits par FranceSoir.

On peut lire que l'épouse déclare qu'elle est certaine que sa mort a été déclenchée par le vaccin",

ainsi que :
> Mère d'un enfant, elle a aussi déclaré: « Dans mon esprit, sa mort était à 100% liée au vaccin. Il n'y a pas d'autre explication. »

Mais un témoignage n'est certainement pas une preuve !`;

const text3 = `De ce que j'en comprends, l'objectif de cet article^85 est de dire que la balance bénéfice/risque du vaccin COVID-19 Pfizer/BioNTech est à réévaluer (vers plus de risque).

L'élément mis en avant ici me semble^95 être le témoignage de l'épouse d'un homme décédé 16 jours après la première injection.
J'ai pu retrouver l'article original (en anglais) sur le DailyMail.com, où l'on retrouve bien les éléments cités et traduits par FranceSoir.

On peut lire que l'épouse
> "déclare qu'elle est certaine que sa mort a été déclenchée par le vaccin"

ainsi que :
> Mère d'un enfant, elle a aussi déclaré: « Dans mon esprit, sa mort était à 100% liée au vaccin. Il n'y a pas d'autre explication. »

Mais un témoignage n'est certainement pas une preuve !
En plus, il est indiqué que l'enquête est en cours, il est donc, de toute façon, trop tôt pour tirer des conclusions sur le lien entre la mort et le vaccin.

Rien ne me permet de dire que la balance bénéfice/risque en est affectée. Prudence donc, avec ce qu'on lit sur FranceSoir !`;

const text4 = `De ce que j'en comprends, l'objectif de cet article^85 est de dire que la balance bénéfice/risque du vaccin COVID-19 Pfizer/BioNTech est à réévaluer (vers plus de risque).

L'élément mis en avant ici me semble^95 être le témoignage de l'épouse d'un homme décédé 16 jours après la première injection.
J'ai pu retrouver l'article original (en anglais) sur le [DailyMail.com](https://www.dailymail.co.uk/news/article-9119431/Miami-doctor-58-dies-three-weeks-receiving-Pfizer-Covid-19-vaccine.html), où l'on retrouve bien les éléments cités et traduits par FranceSoir.

On peut lire que l'épouse
> "déclare qu'elle est certaine que sa mort a été déclenchée par le vaccin"

ainsi que :
> Mère d'un enfant, elle a aussi déclaré: « Dans mon esprit, sa mort était à 100% liée au vaccin. Il n'y a pas d'autre explication. »

Mais un témoignage n'est certainement pas une preuve !
En plus, il est indiqué que l'enquête est en cours, il est donc, de toute façon, trop tôt pour tirer des conclusions sur le lien entre la mort et le vaccin.

Rien ne me permet de dire que la balance bénéfice/risque en est affectée. Prudence donc, avec ce qu'on lit sur FranceSoir !`;

// cspell:word bopzor
const bopzor = createAuthorDto({ nick: 'bopzor' });

const comment = createCommentDto({
  id: 'commentId',
  author: bopzor,
  text: text4,
  edited: new Date('2022-08-14').toISOString(),
  history: [
    {
      date: new Date('2022-01-01').toISOString(),
      text: text1,
    },
    {
      date: new Date('2022-04-02').toISOString(),
      text: text2,
    },
    {
      date: new Date('2022-08-07').toISOString(),
      text: text3,
    },
  ],
  upvotes: 61,
  downvotes: 25,
});
