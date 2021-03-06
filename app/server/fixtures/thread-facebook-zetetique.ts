import { createCommentEntity, createThreadEntity, createUser } from '~/server/test/factories';

import { CommentAuthor } from '../thread/comment.entity';

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

const thread = createThreadEntity({
  id: '38pvde',
  author: Hegel,
  created: '2022-02-03T11:42',
  text: `Hello tout le monde

J'esp??re que vous allez bien

Parmi la communaut?? z??t??tique je n'apprends rien ??  personne en parlant du fait qu'une des bases des outils qu'on manie sont les biais cognitifs.

Et je vois souvent des personnes issues du joli monde des sciences humaines rappeler qu'il y a tout un ??tat de l'art, des ressources etc et que conna??tre seul les biais cognitifs avec z??ro connaissance du contexte autour, du fonctionnement du cerveau et toutes choses ??gales par ailleurs que je ne connais pas moi m??me, ignorante du sujet que je suis, ne permet pas une lecture compl??te des choses.

J'aurai aim?? avoir des explications sur : dans quoi s'ancrent comme disciplines etc les biais cognitifs ? Quelles sont les ??volutions, remises en questions et critiques s'il y a ?

Je serais aussi preneuse de ressources, quelles soient sous forme de livre, articles  podcast, vid??os etc

Merci d'avance de vos retours

Belle soir??e`,
});

const comments = [
  createCommentEntity({
    id: 'qb0mxo',
    threadId: thread.id,
    author: Spinoza,
    creationDate: '2022-02-04T18:51',
    text: `Daniel Kahneman me semble un auteur pertinent sur le sujet...`,
    upvotes: 17,
    downvotes: 3,
  }),
  createCommentEntity({
    id: '1tj876',
    threadId: thread.id,
    author: Voltaire,
    creationDate: '2022-02-05T19:05',
    upvotes: 48,
    downvotes: 9,
    text: `Hello.

Je pense que les billets qui parlent des bais cognitifs sur le blog de Zet Ethique Metacritique r??sument bien le probl??me du coup je vais me contenter de renvoyer vers ces billets :

[https://zet-ethique.fr/2020/02/20/les-gens-pensent-mal-le-mal-du-siecle-partie-1-6-critique-du-concept-de-biais-cognitif/](https://zet-ethique.fr/2020/02/20/les-gens-pensent-mal-le-mal-du-siecle-partie-1-6-critique-du-concept-de-biais-cognitif/)

Expliquer le comportement de quelqu'un ou ses choix en se basant sur des biais cognitifs est extr??mement r??ducteur et caricatural. Aucun psychologue cognitiviste n'utilise ce genre d'explications qu'on trouve parfois chez les rationalistes.

Vous croyez au paranormal? Biais cognitifs... Vous ??tes radicalis??? Biais cognitifs... Ben non.

**Les biais ne sont qu'une minuscule pi??ce du puzzle des "cognitions".** Pour comprendre le comportement et les choix, il faut connaitre l'histoire d'une personne, sa vision du monde, l'histoire de son groupe social, les rapports de pouvoirs et les discriminations dans lesquelles ce groupe est pris, la culture ambiante, la situation ??conomique, etc etc... Y a pleins de crit??res ?? prendre en compte.

Si vous voyez quelqu'un expliquer un comportement par des biais cognitifs, vous ??tes face ?? un r??ductionnisme extr??me, et vous pouvez d??j?? tirer comme conclusion que la personne en question ne comprend pas grand chose ?? la psychologie humaine.

Malheureusement, certains sceptiques et rationalistes donnent bcps trop de place ?? ces biais cognitifs, m??me s'ils ne sont pas tous aussi caricaturaux bien sur. Les biais peuvent expliquer certains erreurs de perception assez bien, mais pas vraiment les attitudes des gens.`,
  }),
  createCommentEntity({
    id: 'o7ihv3',
    threadId: thread.id,
    author: GeraldBronner,
    creationDate: '2022-02-08T11:43',
    upvotes: 10,
    downvotes: 0,
    text: `Je me permets d indiquer qu il y a une quinzaine d ann??es j ai publi?? ceci. Un livre qui aborde de fa??on critique certaines interpr??tations trop rapides des notions d heuristique et de biais cognitifs. A part cela je suis d accord avec les indications de Sade.
[https://www.puf.com/content/Lempire_de_lerreur](https://www.puf.com/content/Lempire_de_lerreur)`,
  }),
];

const replies = [
  createCommentEntity({
    id: 'jcbyg3',
    threadId: thread.id,
    author: Hegel,
    parentId: comments[0].id,
    creationDate: '2022-02-08T11:43',
    upvotes: 2,
    text: `Spinoza justement je discutais encore aujourd'hui avec des personnes qui me disaient que sur ce sujet c'??tait ta base Au d??part mais que aujourd'hui eh bien il ??tait de loin d??pass?? etc`,
  }),

  createCommentEntity({
    id: '5ag695',
    threadId: thread.id,
    author: Nietzsche,
    parentId: comments[1].id,
    creationDate: '2022-02-08T11:43',
    text: `Et aussi voir Albert Moukheiber chez Meta de Choc + son livre. La discipline dans laquelle l'??tude des biais cognitifs est ancr??e sont les neurosciences.`,
  }),

  createCommentEntity({
    id: 'w2rbxb',
    threadId: thread.id,
    author: Montaigne,
    parentId: comments[1].id,
    creationDate: '2022-02-08T11:43',
    text: `Voltaire en d'autres termes, ne parlons plus de biais cognitifs, parlons d'habitus c'est bien plus int??ressant ????`,
  }),

  createCommentEntity({
    id: '38hzam',
    threadId: thread.id,
    author: Sade,
    parentId: comments[1].id,
    creationDate: '2022-02-08T11:43',
    text: `Voltaire D??sol?? de te contredire, mais aucune personne de zet-ethique avec qui j'avais discut?? avant d'??tre vir?? de leur groupe n'a jamais travaill?? sur la question des biais cognitifs (ni m??me lu les travaux des fondateurs et des critiques). J'y ai consacr?? une bonne partie de ma th??se et certains de mes articles, c'est une hypoth??se tr??s forte en psychologie cognitive et sociale (et ??a vient en neurosciences), m??me si bien s??r il y a des critiques. Le fait que les variables sociales agissent aussi concernant par exemple le complotisme, ou le racisme, ou tout ce qu'on veut, n'emp??che absolument pas qu'il y ait aussi des biais cognitifs. Donc oui, il est id??ologique de croire que par exemple le complotisme n'est que cognitif (cela ??vite de penser ses racines socio-politiques), mais il est tout aussi id??ologique de nier les aspects cognitifs, sugg??r??s par toute une s??rie d'??tudes. Donc plut??t que de nier l'existence de certains facteurs et pas d'autres, le plus int??ressant pour les sciences sociales sera de comparer l'effet des variables cognitives et sociales, dans des ph??nom??nes comme le complotisme et les croyances en g??n??ral. Si tu veux, on peut faire une fois une interview sur cette question des biais, comment on les mesure, en abordant ce que disent les critiques inform??s (Gigerenzer), et pas inform??s (zet-ethique) ????`,
  }),

  createCommentEntity({
    id: '7azsus',
    threadId: thread.id,
    author: Sade,
    parentId: comments[1].id,
    creationDate: '2022-02-08T11:43',
    text: `Voltaire Si tu veux que je sois plus pr??cis dans ma critique, je changerais passablement les qualificatifs que tu utilises dans ton post : "Expliquer le comportement de quelqu'un ou ses choix en se basant sur des biais cognitifs est extr??mement r??ducteur et caricatural" : non, ce n'est pas extr??mement r??ducteur et caricatural. Il y a certains choix et certains comportement qui sont certainement en grande partie dus aux biais cognitifs, ce n'est pas une affaire de d??calration mais de recherche. "Aucun psychologue cognitiviste n'utilise ce genre d'explications qu'on trouve parfois chez les rationalistes". On peut statistiquement contr??ler l'effet des variables sociales, et regarder si les biais cognitifs expliquent encore une partie de la variance. Par exemple, dans notre ??tude sur les Gilets Jaunes, on peut contr??ler toutes les variables sociales (comme le niveau d'??ducation, le salaire, etc.) et constater qu'il y a toujours une corr??lation entre croyances aux complots et au paranormal ; cela sugg??re au moins une explication en termes cognitifs, et du moins ce sera une question ?? r??pondre avec des ??tudes empiriques :

"Vous croyez au paranormal? Biais cognitifs... Vous ??tes radicalis??? Biais cognitifs... " : il y a des ??tudes scientifiques qui le sugg??rent (que c'est en partie dus ?? certains biais), donc si on veut d??montrer le contraire, on ne peut le faire que par des ??tudes scientifiques.

"Les biais ne sont qu'une minuscule pi??ce du puzzle des "cognitions". Pour comprendre le comportement et les choix, il faut connaitre l'histoire d'une personne, sa vision du monde, l'histoire de son groupe social, les rapports de pouvoirs et les discriminations dans lesquelles ce groupe est pris, la culture ambiante, la situation ??conomique, etc etc... Y a pleins de crit??res ?? prendre en compte." : ce n'est pas affaire de croyance, mais d'??tudes empiriques (le "minuscule" aussi, cela peut se calculer comme je le disais statistiquement, mais cela ne peut pas se d??cr??ter comme "immense" ni "minuscule".

"Si vous voyez quelqu'un expliquer un comportement par des biais cognitifs, vous ??tes face ?? un r??ductionnisme extr??me, et vous pouvez d??j?? tirer comme conclusion que la personne en question ne comprend pas grand chose ?? la psychologie humaine." Donc tu veux dire que certains psychologues reconnus comme Stanovich, Pennycook, Kahneman, etc. ne "comprennent pas grand chose ?? la psychologie humaine ?" Je ne sais pas si tu vois comme moi la force (pour ne pas dire l'??normit??) de l'affirmation ??

"Malheureusement, certains sceptiques et rationalistes donnent bcps trop de place ?? ces biais cognitifs" : encore une fois, juger la place des biais ne se d??cide pas, c'est une affaire de recherche. "Les biais peuvent expliquer certains erreurs de perception assez bien, mais pas vraiment les attitudes des gens" : L?? je peux t'envoyer les travaux sur les biais cognitifs et les croyances, y'en a des dizaines. Donc bref, je pense que la position la plus rationnelle est que les biais, comme les variables sociales, expliquent une part des d??cisions et des comportements humains, mais il faut pour moi ??tre prudent dans tous les sens, et attendre des recherches (et se baser pour l'instant ?? celles existantes) pour juger de leur importance relative. Ton post et la critique zet-??thique sont pour moi des critiques bien s??r en partie vraie mais exag??r??es, et pas assez bas??es sur les travaux en psychologie.`,
  }),
];

export default {
  thread,
  comments: [...comments, ...replies],
};
