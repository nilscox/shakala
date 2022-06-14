import { createComment, createThread, createUser } from 'backend-application';
import { CommentAuthor } from 'backend-domain';

const Hegel = CommentAuthor.create(
  createUser({
    id: 'avsj9o',
    nick: 'Hegel',
  }),
);

const Spinoza = CommentAuthor.create(
  createUser({
    id: '7mykjc',
    nick: 'Spinoza',
    profileImage: 'https://centresevres.com/content/uploads/2017/07/spinoza.jpg',
  }),
);

const Descartes = CommentAuthor.create(
  createUser({
    id: 't5tpe8',
    nick: 'Descartes',
    profileImage: 'https://www.superprof.fr/blog/wp-content/uploads/2019/01/descartes-maths-histoire.jpg',
  }),
);

const Voltaire = CommentAuthor.create(
  createUser({
    id: '8t0gzh',
    nick: 'Voltaire',
    profileImage:
      'https://static.lexpress.fr/medias_1683/w_664,h_289,c_crop,x_0,y_103/w_968,h_545,c_fill,g_north/v1404805238/francois-marie-arouet-dit-voltaire_861724.jpg',
  }),
);

const Nietzsche = CommentAuthor.create(
  createUser({
    id: 'x33knw',
    nick: 'Nietzsche',
    profileImage:
      'https://cdn.radiofrance.fr/s3/cruiser-production/2017/12/19e7e490-e2cf-4dd7-aab4-787c17053135/838_054_zep1939.jpg',
  }),
);

const Leibniz = CommentAuthor.create(
  createUser({
    id: 'vxl5je',
    nick: 'Leibniz',
    profileImage:
      'https://unphilosophe.files.wordpress.com/2017/11/161110_ft_gottfried-leibniz-crop-promo-xlarge2.jpg',
  }),
);

const Socrate = CommentAuthor.create(
  createUser({
    id: 'vcz0gf',
    nick: 'Socrate',
    profileImage: 'https://i.ytimg.com/vi/OH6sBelUfak/maxresdefault.jpg',
  }),
);

const Montaigne = CommentAuthor.create(
  createUser({
    id: 'gjatw4',
    nick: 'Montaigne',
    profileImage: 'https://www.philomag.com/sites/default/files/images/_web_montaigne_michel_de_0.jpg',
  }),
);

const Sade = CommentAuthor.create(
  createUser({
    id: '85pezg',
    nick: 'Sade',
  }),
);

const Kant = CommentAuthor.create(
  createUser({
    id: 'ic61bm',
    nick: 'Kant',
    profileImage:
      'https://static.lpnt.fr/images/2017/04/13/8231207lpw-8241898-article-emmanuel-kant-jpg_4224233_1250x625.jpg',
  }),
);

const Astrocept = CommentAuthor.create(
  createUser({
    id: 'yyr3ku',
    nick: 'Astrocept',
    profileImage:
      'https://images.ladepeche.fr/api/v1/images/view/610f4bb03e4546786f7ff37b/large/image.jpg?v=1',
  }),
);

const GeraldBronner = CommentAuthor.create(
  createUser({
    id: 'n8yp34',
    nick: 'Gerald Bronner',
    profileImage:
      'https://cdn.radiofrance.fr/s3/cruiser-production/2019/10/2815dc1e-749a-4903-a3ea-ba959a40aa1f/1136_bronner_parloic_thebaud_couleur2.jpg',
  }),
);

const thread = createThread({
  id: '38pvde',
  author: Hegel,
  created: '2022-02-03T11:42',
  text: `Hello tout le monde

J'espère que vous allez bien

Parmi la communauté zététique je n'apprends rien à  personne en parlant du fait qu'une des bases des outils qu'on manie sont les biais cognitifs.

Et je vois souvent des personnes issues du joli monde des sciences humaines rappeler qu'il y a tout un état de l'art, des ressources etc et que connaître seul les biais cognitifs avec zéro connaissance du contexte autour, du fonctionnement du cerveau et toutes choses égales par ailleurs que je ne connais pas moi même, ignorante du sujet que je suis, ne permet pas une lecture complète des choses.

J'aurai aimé avoir des explications sur : dans quoi s'ancrent comme disciplines etc les biais cognitifs ? Quelles sont les évolutions, remises en questions et critiques s'il y a ?

Je serais aussi preneuse de ressources, quelles soient sous forme de livre, articles  podcast, vidéos etc

Merci d'avance de vos retours

Belle soirée`,
});

const comments = [
  createComment({
    id: 'qb0mxo',
    threadId: thread.id,
    author: Spinoza,
    creationDate: '2022-02-04T18:51',
    text: `Daniel Kahneman me semble un auteur pertinent sur le sujet...`,
    upvotes: 17,
    downvotes: 3,
  }),
  createComment({
    id: '1tj876',
    threadId: thread.id,
    author: Voltaire,
    creationDate: '2022-02-05T19:05',
    upvotes: 48,
    downvotes: 9,
    text: `Hello.

Je pense que les billets qui parlent des bais cognitifs sur le blog de Zet Ethique Metacritique résument bien le problème du coup je vais me contenter de renvoyer vers ces billets :

[https://zet-ethique.fr/2020/02/20/les-gens-pensent-mal-le-mal-du-siecle-partie-1-6-critique-du-concept-de-biais-cognitif/](https://zet-ethique.fr/2020/02/20/les-gens-pensent-mal-le-mal-du-siecle-partie-1-6-critique-du-concept-de-biais-cognitif/)

Expliquer le comportement de quelqu'un ou ses choix en se basant sur des biais cognitifs est extrêmement réducteur et caricatural. Aucun psychologue cognitiviste n'utilise ce genre d'explications qu'on trouve parfois chez les rationalistes.

Vous croyez au paranormal? Biais cognitifs... Vous êtes radicalisé? Biais cognitifs... Ben non.

**Les biais ne sont qu'une minuscule pièce du puzzle des "cognitions".** Pour comprendre le comportement et les choix, il faut connaitre l'histoire d'une personne, sa vision du monde, l'histoire de son groupe social, les rapports de pouvoirs et les discriminations dans lesquelles ce groupe est pris, la culture ambiante, la situation économique, etc etc... Y a pleins de critères à prendre en compte.

Si vous voyez quelqu'un expliquer un comportement par des biais cognitifs, vous êtes face à un réductionnisme extrême, et vous pouvez déjà tirer comme conclusion que la personne en question ne comprend pas grand chose à la psychologie humaine.

Malheureusement, certains sceptiques et rationalistes donnent bcps trop de place à ces biais cognitifs, même s'ils ne sont pas tous aussi caricaturaux bien sur. Les biais peuvent expliquer certains erreurs de perception assez bien, mais pas vraiment les attitudes des gens.`,
  }),
  createComment({
    id: 'o7ihv3',
    threadId: thread.id,
    author: GeraldBronner,
    creationDate: '2022-02-08T11:43',
    upvotes: 10,
    downvotes: 0,
    text: `Je me permets d indiquer qu il y a une quinzaine d années j ai publié ceci. Un livre qui aborde de façon critique certaines interprétations trop rapides des notions d heuristique et de biais cognitifs. A part cela je suis d accord avec les indications de Sade.
[https://www.puf.com/content/Lempire_de_lerreur](https://www.puf.com/content/Lempire_de_lerreur)`,
  }),
];

const replies = [
  createComment({
    id: 'jcbyg3',
    threadId: thread.id,
    author: Hegel,
    parentId: comments[0]?.id,
    creationDate: '2022-02-08T11:43',
    upvotes: 2,
    text: `Spinoza justement je discutais encore aujourd'hui avec des personnes qui me disaient que sur ce sujet c'était ta base Au départ mais que aujourd'hui eh bien il était de loin dépassé etc`,
  }),

  createComment({
    id: '5ag695',
    threadId: thread.id,
    author: Nietzsche,
    parentId: comments[1]?.id,
    creationDate: '2022-02-08T11:43',
    text: `Et aussi voir Albert Moukheiber chez Meta de Choc + son livre. La discipline dans laquelle l'étude des biais cognitifs est ancrée sont les neurosciences.`,
  }),

  createComment({
    id: 'w2rbxb',
    threadId: thread.id,
    author: Montaigne,
    parentId: comments[1]?.id,
    creationDate: '2022-02-08T11:43',
    text: `Voltaire en d'autres termes, ne parlons plus de biais cognitifs, parlons d'habitus c'est bien plus intéressant 👍`,
  }),

  createComment({
    id: '38hzam',
    threadId: thread.id,
    author: Sade,
    parentId: comments[1]?.id,
    creationDate: '2022-02-08T11:43',
    text: `Voltaire Désolé de te contredire, mais aucune personne de zet-ethique avec qui j'avais discuté avant d'être viré de leur groupe n'a jamais travaillé sur la question des biais cognitifs (ni même lu les travaux des fondateurs et des critiques). J'y ai consacré une bonne partie de ma thèse et certains de mes articles, c'est une hypothèse très forte en psychologie cognitive et sociale (et ça vient en neurosciences), même si bien sûr il y a des critiques. Le fait que les variables sociales agissent aussi concernant par exemple le complotisme, ou le racisme, ou tout ce qu'on veut, n'empêche absolument pas qu'il y ait aussi des biais cognitifs. Donc oui, il est idéologique de croire que par exemple le complotisme n'est que cognitif (cela évite de penser ses racines socio-politiques), mais il est tout aussi idéologique de nier les aspects cognitifs, suggérés par toute une série d'études. Donc plutôt que de nier l'existence de certains facteurs et pas d'autres, le plus intéressant pour les sciences sociales sera de comparer l'effet des variables cognitives et sociales, dans des phénomènes comme le complotisme et les croyances en général. Si tu veux, on peut faire une fois une interview sur cette question des biais, comment on les mesure, en abordant ce que disent les critiques informés (Gigerenzer), et pas informés (zet-ethique) 😉`,
  }),

  createComment({
    id: '7azsus',
    threadId: thread.id,
    author: Sade,
    parentId: comments[1]?.id,
    creationDate: '2022-02-08T11:43',
    text: `Voltaire Si tu veux que je sois plus précis dans ma critique, je changerais passablement les qualificatifs que tu utilises dans ton post : "Expliquer le comportement de quelqu'un ou ses choix en se basant sur des biais cognitifs est extrêmement réducteur et caricatural" : non, ce n'est pas extrêmement réducteur et caricatural. Il y a certains choix et certains comportement qui sont certainement en grande partie dus aux biais cognitifs, ce n'est pas une affaire de décalration mais de recherche. "Aucun psychologue cognitiviste n'utilise ce genre d'explications qu'on trouve parfois chez les rationalistes". On peut statistiquement contrôler l'effet des variables sociales, et regarder si les biais cognitifs expliquent encore une partie de la variance. Par exemple, dans notre étude sur les Gilets Jaunes, on peut contrôler toutes les variables sociales (comme le niveau d'éducation, le salaire, etc.) et constater qu'il y a toujours une corrélation entre croyances aux complots et au paranormal ; cela suggère au moins une explication en termes cognitifs, et du moins ce sera une question à répondre avec des études empiriques :

"Vous croyez au paranormal? Biais cognitifs... Vous êtes radicalisé? Biais cognitifs... " : il y a des études scientifiques qui le suggèrent (que c'est en partie dus à certains biais), donc si on veut démontrer le contraire, on ne peut le faire que par des études scientifiques.

"Les biais ne sont qu'une minuscule pièce du puzzle des "cognitions". Pour comprendre le comportement et les choix, il faut connaitre l'histoire d'une personne, sa vision du monde, l'histoire de son groupe social, les rapports de pouvoirs et les discriminations dans lesquelles ce groupe est pris, la culture ambiante, la situation économique, etc etc... Y a pleins de critères à prendre en compte." : ce n'est pas affaire de croyance, mais d'études empiriques (le "minuscule" aussi, cela peut se calculer comme je le disais statistiquement, mais cela ne peut pas se décréter comme "immense" ni "minuscule".

"Si vous voyez quelqu'un expliquer un comportement par des biais cognitifs, vous êtes face à un réductionnisme extrême, et vous pouvez déjà tirer comme conclusion que la personne en question ne comprend pas grand chose à la psychologie humaine." Donc tu veux dire que certains psychologues reconnus comme Stanovich, Pennycook, Kahneman, etc. ne "comprennent pas grand chose à la psychologie humaine ?" Je ne sais pas si tu vois comme moi la force (pour ne pas dire l'énormité) de l'affirmation ??

"Malheureusement, certains sceptiques et rationalistes donnent bcps trop de place à ces biais cognitifs" : encore une fois, juger la place des biais ne se décide pas, c'est une affaire de recherche. "Les biais peuvent expliquer certains erreurs de perception assez bien, mais pas vraiment les attitudes des gens" : Là je peux t'envoyer les travaux sur les biais cognitifs et les croyances, y'en a des dizaines. Donc bref, je pense que la position la plus rationnelle est que les biais, comme les variables sociales, expliquent une part des décisions et des comportements humains, mais il faut pour moi être prudent dans tous les sens, et attendre des recherches (et se baser pour l'instant à celles existantes) pour juger de leur importance relative. Ton post et la critique zet-éthique sont pour moi des critiques bien sûr en partie vraie mais exagérées, et pas assez basées sur les travaux en psychologie.`,
  }),
];

export default {
  thread,
  comments: [...comments, ...replies],
};
