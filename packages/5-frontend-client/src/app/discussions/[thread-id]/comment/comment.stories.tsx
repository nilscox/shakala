import { Meta, Story } from '@storybook/react';
import {
  addComments,
  createComment,
  createThread,
  createUser,
  selectComment,
  addThread,
} from 'frontend-domain';

import { useSelector } from '~/hooks/use-selector';
import { maxWidthDecorator, reduxDecorator, routerDecorator, SetupRedux } from '~/utils/storybook';

import { Comment } from './comment';

export default {
  title: 'Domain/Comment',
  decorators: [reduxDecorator(), routerDecorator(), maxWidthDecorator()],
} as Meta;

const Template: Story<{ setup: SetupRedux; commentId: string }> = ({ commentId }) => {
  const comment = useSelector(selectComment, commentId);

  return <Comment commentId={comment.id} />;
};

// cspell:word bopzor lemonde wikipedia
const bopzor = createUser({ nick: 'Bopzor' });
const nilscox = createUser({ nick: 'nilscox' });

const repliesFixtures = [
  createComment({
    author: nilscox,
    date: new Date().toISOString(),
    text: "Bien vu, merci pour le lien vers l'article. Notons tout de même que [selon lemonde](https://www.lemonde.fr/pixels/article/2017/02/09/le-daily-mail-n-est-plus-une-source-utilisable-sur-wikipedia_5077027_4408996.html), wikipedia ne fait plus confiance au DailyMail depuis 2017 !",
  }),
];

const commentFixture = createComment({
  author: bopzor,
  text: `De ce que j'en comprends, l'objectif de cet article^85 est de dire que la balance bénéfice/risque du vaccin COVID-19 Pfizer/BioNTech est à réévaluer (vers plus de risque).

L'élément mis en avant ici me semble^95 être le témoignage de l'épouse d'un homme décédé 16 jours après la première injection.
J'ai pu retrouver l'article original (en anglais) sur le [DailyMail.com](https://www.dailymail.co.uk/news/article-9119431/Miami-doctor-58-dies-three-weeks-receiving-Pfizer-Covid-19-vaccine.html), où l'on retrouve bien les éléments cités et traduits par FranceSoir.

On peut lire que l'épouse
> "déclare qu’elle est certaine que sa mort a été déclenchée par le vaccin",

ainsi que :
> Mère d'un enfant, elle a aussi déclaré: « Dans mon esprit, sa mort était à 100% liée au vaccin. Il n'y a pas d'autre explication. »

Mais un témoignage n'est certainement pas une preuve !
En plus, il est indiqué que l'enquête est en cours, il est donc, de toute façon, trop tôt pour tirer des conclusions sur le lien entre la mort et le vaccin.

Rien ne me permet de dire que la balance bénéfice/risque en est affectée. Prudence donc, avec ce qu'on lit sur FranceSoir !`,
  date: new Date().toISOString(),
  upvotes: 61,
  downvotes: 25,
  replies: repliesFixtures,
});

export const comment = Template.bind({});
comment.args = {
  setup: (dispatch) => {
    dispatch(addThread(createThread({ comments: [commentFixture] })));
    dispatch(addComments([commentFixture, ...repliesFixtures]));
  },
  commentId: commentFixture.id,
};
