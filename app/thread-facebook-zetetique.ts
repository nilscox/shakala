import { createComment, createThread, createUser } from './factories';

const Hegel = createUser({
  id: 'avsj9o',
  nick: 'Hegel',
});

const Spinoza = createUser({
  id: '7mykjc',
  nick: 'Spinoza',
  image: 'https://centresevres.com/content/uploads/2017/07/spinoza.jpg',
});

const Descartes = createUser({
  id: 't5tpe8',
  nick: 'Descartes',
  image: 'https://www.superprof.fr/blog/wp-content/uploads/2019/01/descartes-maths-histoire.jpg',
});

const Voltaire = createUser({
  id: '8t0gzh',
  nick: 'Voltaire',
  image:
    'https://static.lexpress.fr/medias_1683/w_664,h_289,c_crop,x_0,y_103/w_968,h_545,c_fill,g_north/v1404805238/francois-marie-arouet-dit-voltaire_861724.jpg',
});

const Nietzsche = createUser({
  id: 'x33knw',
  nick: 'Nietzsche',
  image:
    'https://cdn.radiofrance.fr/s3/cruiser-production/2017/12/19e7e490-e2cf-4dd7-aab4-787c17053135/838_054_zep1939.jpg',
});

const Leibniz = createUser({
  id: 'vxl5je',
  nick: 'Leibniz',
  image:
    'https://unphilosophe.files.wordpress.com/2017/11/161110_ft_gottfried-leibniz-crop-promo-xlarge2.jpg',
});

const Socrate = createUser({
  id: 'vcz0gf',
  nick: 'Socrate',
  image: 'https://i.ytimg.com/vi/OH6sBelUfak/maxresdefault.jpg',
});

const Montaigne = createUser({
  id: 'gjatw4',
  nick: 'Montaigne',
  image: 'https://www.philomag.com/sites/default/files/images/_web_montaigne_michel_de_0.jpg',
});

const Sade = createUser({
  id: '85pezg',
  nick: 'Sade',
});

const Kant = createUser({
  id: 'ic61bm',
  nick: 'Kant',
  image:
    'https://static.lpnt.fr/images/2017/04/13/8231207lpw-8241898-article-emmanuel-kant-jpg_4224233_1250x625.jpg',
});

const Astrocept = createUser({
  id: 'yyr3ku',
  nick: 'Astrocept',
  image: 'https://images.ladepeche.fr/api/v1/images/view/610f4bb03e4546786f7ff37b/large/image.jpg?v=1',
});

const GeraldBronner = createUser({
  id: 'n8yp34',
  nick: 'Gerald Bronner',
  image:
    'https://cdn.radiofrance.fr/s3/cruiser-production/2019/10/2815dc1e-749a-4903-a3ea-ba959a40aa1f/1136_bronner_parloic_thebaud_couleur2.jpg',
});

export const threadFacebookZetetique = createThread({
  id: '38pvde',
  author: Hegel,
  text: `Hello tout le monde

J'espère que vous allez bien

Parmi la communauté zététique je n'apprends rien à  personne en parlant du fait qu'une des bases des outils qu'on manie sont les biais cognitifs.

Et je vois souvent des personnes issues du joli monde des sciences humaines rappeler qu'il y a tout un état de l'art, des ressources etc et que connaître seul les biais cognitifs avec zéro connaissance du contexte autour, du fonctionnement du cerveau et toutes choses égales par ailleurs que je ne connais pas moi même, ignorante du sujet que je suis, ne permet pas une lecture complète des choses.

J'aurai aimé avoir des explications sur : dans quoi s'ancrent comme disciplines etc les biais cognitifs ? Quelles sont les évolutions, remises en questions et critiques s'il y a ?

Je serais aussi preneuse de ressources, quelles soient sous forme de livre, articles  podcast, vidéos etc

Merci d'avance de vos retours

Belle soirée`,
  comments: [
    createComment({
      id: 'qb0mxo',
      author: Spinoza,
      text: `Daniel Kahneman me semble un auteur pertinent sur le sujet...`,
      upvotes: 17,
      downvotes: 3,
      replies: [
        createComment({
          id: 'jcbyg3',
          author: Hegel,
          upvotes: 2,
          text: `Spinoza justement je discutais encore aujourd'hui avec des personnes qui me disaient que sur ce sujet c'était ta base Au départ mais que aujourd'hui eh bien il était de loin dépassé etc`,
          replies: [
            createComment({
              id: 'jny71o',
              author: Descartes,
              text: `Hegel dépassé c'est discutable, car il y a quasiment toujours eu des critiques pertinentes avec un courant "opposé" : celui de Gerd Gigerenzer.

  Aujourd'hui d'autres cognitivistes (anthropo, psycho, neuro...) abordent encore la question autrement (cf l'énigme de la raison de Mercier et Sperber).

  Y a encore des auteurs qui estiment que le double processus (système 1 système 2, en gros système intuitif/système analytique) n'existe pas voire même sue les biais n'existent pas et qu'il s'agit uniquement d'artefacts expérimentaux.

  Le fait est que sur les 300 et quelques biais encore référencés il y a quelques années beaucoup semblent être en réalité des facettes de quelques biais "fondamentaux" (comme Dunning Kruger, qui ne serait qu'une régression vers la moyenne d'un autre biais nommé illusion de connaissance), voire pour d'autres c'est carrément leur existence qui est remise en cause car ils n'ont pu être reproduit lorsque le protocole a été amélioré (par ex l'effet d'amorçage tel que décrit par kahneman... maintenant il y a d'autres formes d'amorçages qui semblent plus solides, notamment dans les biais de perception, cf l'illusion de la spinning dancer).

  Je sais pas si je suis pas trop technique 😅`,
            }),
            createComment({
              id: '8pwnhg',
              author: Voltaire,
              upvotes: 2,
              text: `Descartes oui c'est un peu étrange de dire que c'est dépassé. Le problème n'est pas que c'est dépassé, même si certains biais sont évidemment assez critiquables. Le problème est d'utiliser cette minuscule pièce du puzzle cognitif pour expliquer des comportements`,
            }),
          ],
        }),
      ],
    }),
    createComment({
      id: '1tj876',
      author: Voltaire,
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
      replies: [
        createComment({
          id: '5ag695',
          author: Nietzsche,
          text: `Et aussi voir Albert Moukheiber chez Meta de Choc + son livre. La discipline dans laquelle l'étude des biais cognitifs est ancrée sont les neurosciences.`,
          replies: [
            createComment({
              id: '8rlep9',
              author: Leibniz,
              text: `Voltaire je suis moyennement d'accord avec vous dans le sens où les heuristiques (terme que je préfère aux biais cognitifs) sont la base de notre fonctionnement de pensées, et construisent donc l'architecture de nos perceptions du monde, influençant et étant influencées par nos actes.

La sociologie, lorsqu'elle est approfondie, semble bien plus ramener à ces heuristiques, ce qui ne me semble pas si réducteur ou caricatural. Les injonctions sociales, les groupes sociaux, l'éducation, la manière de gérer notre place dans la société, nos valeurs morales, tout cela semble quand même renvoyer à nos heuristiques, quelles qu'elles soient.

Je peut très certainement me tromper, mais ce n'est pas la même chose de dire que tout ramène aux heuristiques que de ne se soucier que de cette partie là de la cognition. De fait, de la même manière que comprendre les biais cognitifs ne signifie pas s'en prémunir dans l'absolu, interpréter les fonctionnements humains en ramenant tout aux heuristiques ne peut pas faire avancer les choses factuellement uniquement par ce biais. Il n'empêche que de creuser le sujet peut-être intéressant pour la compréhension de la nature humaine et de nos fonctionnements.`,
            }),
            createComment({
              id: 'eud4n6',
              author: Descartes,
              text: `Leibniz ce qu'il faut bien comprendre c'est que les biais (s'ils existent, ce qui est discuté dans la litterature, même si y a quand même un bonne part de la recherche qui admet leur existence) ne s'expriment QUE à travers un contexte. Que ce soit l'environnement, et/ou nos avis/jugements/visions. Donc, bien qu'ils soient considérés comme des "automatismes", ça dépend en réalité de différents facteurs qu'il est nécessaire de prendre en compte. Le risque c'est la réduction de l'analyse via les biais, alors que l'environnement est essentiel.`,
            }),
            createComment({
              id: '0hfaeg',
              author: Leibniz,
              text: `Descartes je suis d'accord avec vous. Ceci dit, tout fonctionnement s'établit par un contexte, non ? Un individu pense, agit, évolue, vit à travers des ensembles et sous-ensembles de contextes, il me semble que c'est indiscernable de la notion de "réalité", puisque nous ne pouvons tout simplement pas avoir conscience de tout à instant t. Nous sommes donc obligés de faire des raccourcis mentaux pour dégager une ligne de conduite ou une pensée, et ces raccourcis sont forcément biaisés par... et bien par les éléments contextuels passé, présents et projections futures.

Il ne s'agit pas ici de réfuter quoi que ce soit, j'ai conscience que je n'ai pas de bagage académique à apporter, seulement le fruit de mes réflexions. Vos réponses à ce sujet sont d'ailleurs accueillies avec plaisir, merci d'avoir pris le temps de le faire 🙂`,
            }),
            createComment({
              id: '0rm7zk',
              author: Descartes,
              text: `Leibniz oui, même si certains points sont discutables, vous avez raison. Mais au niveau de la recherche on distingue pas mal de choses déjà rien que dans ce que vous avez dit là.

Par ex, "réalité" ; la rationalité des comportements face au contexte (Kahneman nous estime globalement irrationnel car on fait du réductionnisme du réel, et Gigerenzer estime qu'on est rationnel parce que 99% de nos comportements quotidiens le sont, et Mercier estime qu'on est plutôt globalement rationnel dans notre propre cadre de référence personnel, mais ça dépend de ce qu'on définit comme rationnel, ce qui est une question de norme finalement) ; les différentes étapes entre acquisition de l'information/raisonnement/décision/comportement ; les motivations personnelles et interpersonnelles ; etc etc

Au final, y a énormément de facteurs qu'il convient de ne pas sous-estimer, ce qu'on fait peut-être un peu trop facilement si on réduit notre analyse à une "chasse aux biais", car ça tend à estimer l'autres comme irrationnel car plein de biais, alors que comme expliqué plus haut la question de la rationalité est elle-même très discutée.

Ce qui ne veut pas dire que connaître les biais et les repérer n'a aucun intérêt 😉`,
            }),
            createComment({
              id: '0zig1r',
              author: Leibniz,
              text: `Descartes Merci pour les informations, je n'avais pas connaissance de ces réflexions sur le concept de réalité, je vais aller voir ça de plus près, ça me semble très intéressant ! Et je suis d'accord sur le fond et même dans l'absolu : se cantonner à une réponse simple face à des phénomènes aussi complexes et multifactoriels me semble effectivement et intuitivement assez réducteur.`,
            }),
            createComment({
              id: '4e1omv',
              author: Descartes,
              text: `Leibniz ce n'est pas tant la question de la "réalité" qui est questionnée que celle de nos représentations de celle-ci.

La réalité existe indépendamment de nous, mais en science humaine la question de la réalité n'est pas toujours pertinente.

Pour expliquer un comportement, la réalité n'a pas toujours sa place. On peut avoir de bonnes raisons de croire un truc faux. Par ex, pendant très longtemps on a cru que les cygnes étaient forcément blancs. Il y avait même une expression qui serait l'équivalent anglais du "quand les poules auront des dents" et qui disait (de souvenir) "quand on verra un cygne noir"... Il y avait à l'époque autant de raison de croire dans les cygnes noirs que de croire dans les licornes. Et encore on avait plus de "traces" des licornes (fausses traces : on vendait des cornes de Nerval comme étant des cornes de licorne. C'était faux, mais ça reste un indice certes pauvre mais un indice quand même... il n'y avait AUCUN indice concernant des cygnes noirs).

Eh bien un jour on a découvert des cygnes noirs...

Et on avait pourtant de bonnes raisons de ne pas y croire. Ce qui importe ici c'est de comprendre pourquoi on a cru que les cygnes noirs n'existaient pas, plutôt que de savoir qu'ils existent. Savoir qu'ils existent nous renseigne sur l'existence, non pas sur le comportement. Ca dépend ce quon cherche a savoir. En science humaine ça serait plus le comportement, ou ici la croyance, qui nous intéresserait.`,
            }),
            createComment({
              id: 'mstsic',
              author: Socrate,
              text: `Descartes . Le contexte, l’environnement, les histoires personnelles et/ou familiales etc…. Bien sûr et personne ne s’aventurerait à minimiser voire nier l’influence de tout ça dans la manière d’appréhender les événements quotidiens.

Mais justement, les biais cognitifs agissent sur cette manière.

Ils ne se substituent pas, ni ne s’effacent.

Ils s’ajoutent au bout du compte au moment de la décision et l’orientent.`,
            }),
            createComment({
              id: 'nkr2r3',
              author: Descartes,
              text: `Socrate ben justement c'est très discuté dans la littérature.

Non pas qu'ils n'agissent pas, mais plus que le passage du "déclenchement" de l'heuristique à l'action, il y a encore plusieurs étapes où celle-ci peut être contrée ou compenser.

Aussi des chercheurs comme Gerd Gigerenzer maintiennent et ont prouvé dans plusieurs registres que les heuristiques sont bien plus souvent avantageuses que trompeuses, et qu'un cadre adapté fait généralement disparaître ces biais.

Par ex le biais de conformation dans les tâches de sélection de Wason est très largement atténué par une reconfiguration des expériences :

[https://pubmed.ncbi.nlm.nih.gov/7587018/?dopt=Abstract](https://pubmed.ncbi.nlm.nih.gov/7587018/?dopt=Abstract)`,
            }),
            createComment({
              id: 'l89mgd',
              author: Descartes,
              text: `Leibniz sur le gap intention-action
[https://asistdl.onlinelibrary.wiley.com/doi/abs/10.1002/asi.20816](https://asistdl.onlinelibrary.wiley.com/doi/abs/10.1002/asi.20816)`,
            }),
          ],
        }),
        createComment({
          id: 'w2rbxb',
          author: Montaigne,
          text: `Voltaire en d'autres termes, ne parlons plus de biais cognitifs, parlons d'habitus c'est bien plus intéressant 👍`,
        }),
        createComment({
          id: '38hzam',
          author: Sade,
          text: `Voltaire Désolé de te contredire, mais aucune personne de zet-ethique avec qui j'avais discuté avant d'être viré de leur groupe n'a jamais travaillé sur la question des biais cognitifs (ni même lu les travaux des fondateurs et des critiques). J'y ai consacré une bonne partie de ma thèse et certains de mes articles, c'est une hypothèse très forte en psychologie cognitive et sociale (et ça vient en neurosciences), même si bien sûr il y a des critiques. Le fait que les variables sociales agissent aussi concernant par exemple le complotisme, ou le racisme, ou tout ce qu'on veut, n'empêche absolument pas qu'il y ait aussi des biais cognitifs. Donc oui, il est idéologique de croire que par exemple le complotisme n'est que cognitif (cela évite de penser ses racines socio-politiques), mais il est tout aussi idéologique de nier les aspects cognitifs, suggérés par toute une série d'études. Donc plutôt que de nier l'existence de certains facteurs et pas d'autres, le plus intéressant pour les sciences sociales sera de comparer l'effet des variables cognitives et sociales, dans des phénomènes comme le complotisme et les croyances en général. Si tu veux, on peut faire une fois une interview sur cette question des biais, comment on les mesure, en abordant ce que disent les critiques informés (Gigerenzer), et pas informés (zet-ethique) 😉`,
          replies: [
            createComment({
              id: '48ackr',
              author: Voltaire,
              text: `Sade je ne pense pas que personne chez ZEM nie les aspects cognitifs. Ce qui ressort de leurs billets, c'est surtout ce que tu dis toi même : ne pas donner une importance trop grande à ces biais qui ne sont qu'une petite partie du puzzle, et ne plus oublier tous les autres facteurs. Je sais bien qu'ils n'ont pas "travaillés" sur la psycho cognitive mais leurs billets sur cette question me semblent quand même assez pertinents et rejoignent ma propre opinion explicitée plus haut. Moi non plus je ne nie pas l'existence des biais cognitifs, et je les utilise de temps à autre, vu que je pratique aussi la thérapie cognitive. J'ai l'impression que les gens de ZEM pensent la même chose que ce que tu viens d'écrire d'ailleurs... Ce qui est critiqué est la réduction aux biais cognitifs, et pas le concept lui même`,
            }),
            createComment({
              id: 'adtyv5',
              author: Voltaire,
              text: `Nietzsche ?`,
            }),
            createComment({
              id: 'ovtfzo',
              author: Kant,
              text: `Leurs articles sont d'une pauvreté... On dirait des jeunes amateurs qui veulent réinventer la roue, sans avoir lu, appris, bref s'être formé auparavant a minima sur le sujet. Et ils veulent donner des leçons...

Tout leur argumentaire se base sur des hommes de pailles successifs, comme "Les sphères rationalistes ont une rengaine : les gens pensent mal.". Affirmations fallacieuse qu'ils démontent évidemment ensuite (de manière plus ou moins sophistique). Ils ont alors l'impression d'avoir dit un truc intelligent. Hommes de paille...

Perso, leurs articles sont des cas d'école pour jouer à repérer justement les biais qu'ils semblent tant détester.`,
            }),
            createComment({
              id: '8j58qc',
              author: Nietzsche,
              text: `Voltaire oui on nie pas du tout qu'il y a des biais cognitifs, on dit totalement explicitement que c'est réduire l'analyse aux biais qui pose problème.

(NB Pascal comme j'avais explicité ce groupe avait vocation à rassembler les gens proches de nous politiquement, c'était pas une condamnation morale, on a le droit d'avoir des espaces entre gens proches... on a un aytre groupe ouvert à tous, avec des objectifs différents).

(Tfacon il se passe pas grand chose dans aucun des groupes, on est trop usés par la mauvaise foi de certaines personnes qui prennent nos critiques *étayées* pour des attaques personnelles...)`,
            }),
            createComment({
              id: '7347e5',
              author: Nietzsche,
              text: `Quand au fait que notre travail serait truffé de biais : n'hésitez pas à argumenter vos critiques dans la section commentaire de nos billets, car pour le moment ça se limite à ce genre de déclarations pauvres, et c'est bien dommage car du coup personne ne progresse.`,
            }),
            createComment({
              id: 'bpsi8g',
              author: Voltaire,
              text: `Kant marrant, moi j'ai bossé 10 ans avec la thérapie cognitive et j'ai étudié la psycho, mais je n'ai pas l'impression que c'est "pauvre" ou "fallacieux". Je constate aussi que toutes leurs affirmations sont bien détaillées et argumentées. Alors après je suis pas toujours d'accord avec tout à 100%.

Par contre votre commentaire c'est juste une affirmation sans arguments, donc on ne pourra pas du tout se faire la moindre idée sur la pertinence de votre critique, ou savoir si c'est autre chose qu'une attaque gratuite.`,
            }),
            createComment({
              id: 't7xiyi',
              author: Voltaire,
              text: `Sade Ok ben ça confirme ce que je disais plus haut. Pour moi, ZEM ne dit pas autre chose que ce que tu as écris toi même plus haut.

Du coup, peut être qu'il y a des critiques à faire, mais en tout cas pas celle que tu as énoncé. Faudrait voir si tu as des critiques de détails pour que cette discussion apporte quelque chose, sinon c'est juste des échanges d'accusations sans arguments.

Ici en fait , tu dis la même chose que moi et Aurélie ... Du coup impossible de savoir sur quoi porterait la critique`,
            }),
            createComment({
              id: 'jrw9ho',
              author: Sade,
              text: `Voltaire Si tu veux pour moi, cette critique est un peu trop idéologique, comme le point de vue adverse qui est dénoncé, puisqu'elle ne repose pas sur les travaux empiriques (la critique ne peut être qu'empirique, comme l'est l'affirmation de l'existence des biais). Donc le travers idéologique est le même pour celles et ceux qui jugent de l'importance relative des variables sociales et cognitives SANS arguments empiriques (sans connaître la plupart des études, des premières de Wason et Kahneman & Tversky, des suivantes de Johnson-Laird et Evans, les travaux en psychologie sociale, les perspectives cognitives, motivationnelles, sociales, avec la cognition motivée, etc. ; et surtout des plus récentes sur les croyances de Pennycook et Stanovich, avec tous les très longs débats qui ont suivi certains articles en 1981, 1997, 2004, etc. ; les débats sur Sytème 1 / Système 2, etc. ; ce sont des milliers de pages, avec critiques et réponses aux critiques, qu'on ne peut pas ne pas un peu connaître à mon avis si on veut juger des biais cognitifs). Vraiment faisons un entretien, du temps de ma thèse j'avais un point de vue plus critique sur les biais (parce que les tâches de Wason et K&T que j'avais étudiées sont très discutables), mais j'ai aujourd'hui un point de vue moins critique, en raison des arguments empiriques dont j'ai pris connaissance, notamment sur les croyances. Une des grandes critiques des biais était leur potentiel caractère artefactuel (qui seraient dûs à tâche, au contexte du labo) n'est qu'en partie vrai, comme l'ont montré beaucoup d'études sur les croyances. Le fait que les croyances "externes" (au labo, à la situation) soient assez systématiquement liées à des mesures de biais cognitifs est un nouvel argument de ces 10 dernière années (notamment les croyances au complot, mais aussi paranormales, et religieuses), qui change passablement la donne. La plupart des critiques informées que j'entends s'arrêtent à Gigerenzer, mais depuis Gigerenzer, il y a eu pas mal de nouveauté. Bref, franchement, je pense qu'un petit entretien-débat à plusieurs pourrait intéresser beaucoup de monde qui se pose des questions sur les biais (même si bien sûr mon point de vue est un point de vue parmi d'autres, il a l'avantage d'être informé par certaines recherches ; alors bien sûr, il reste possible que j'ignore d'autres recherches, ou que je les interprète mal, mais au moins cela donne des infos sur ces recherches).`,
            }),
            createComment({
              id: 'jck50n',
              author: Kant,
              text: `Voltaire
"Par contre votre commentaire c'est juste une affirmation sans arguments"

Marrant. Ben. Non... J'ai écris l'argument suivant :

"Tout leur argumentaire se base sur des hommes de pailles successifs, comme "Les sphères rationalistes ont une rengaine : les gens pensent mal.". Affirmations fallacieuse qu'ils démontent évidemment ensuite (de manière plus ou moins sophistique). Ils ont alors l'impression d'avoir dit un truc intelligent. Hommes de paille..."

Donc l'affirmation "Les sphères rationalistes ont une rengaine : les gens pensent mal." est-elle vraie ? Oui ? Non ?

Vous affirmez que "Je constate aussi que toutes leurs affirmations sont bien détaillées et argumentées." Où sont donc ces preuves étayées de cette pseudo-rengaine dans les sphères rationalistes ? Perso, moi qui les fréquentes depuis de longues années, les discours sont bien plus nuancés, complexes, riches que cette affirmation simpliste.

Cette affirmation de rengaine est-elle bien une exagération de la position adverse ? Si oui, c'est bien un homme de paille...

("Sphère rationaliste" qui n'a rien compris selon eux tout au long de leurs articles successifs. Mais qui répètent ensuite nombre de choses que les rationalistes disent eux-mêmes...)

J'ai donc bien fourni un argument contrairement à ce que vous affirmez et que par contre c'est bien vous qui n'avez fourni aucun contre-argument sérieux à ma critique, si ce n'est une attaque gratuite et fallacieuse.

Echange peu intéressant mais il me semblait nécessaire de répondre à une fausse accusation.

(Je ferai peut-être une analyse du premier paragraphe, qui en quelques lignes montrent divers problèmes dans la rhétorique utilisée.)`,
            }),
            createComment({
              id: 'xfctoj',
              author: Astrocept,
              text: `Sade as-tu proposé cela à Wil Ly pour les REC 2 ? Albert sera aussi sur place avec tant d'autres personnes...`,
            }),
            createComment({
              id: 'z8pf6e',
              author: Sade,
              text: `Astrocept Je suis en train de discuter avec Thomas pour une vidéo sur la "science des biais cognitifs", je me rends compte que la plupart des gens qui en parlent ne connaissent pas la grande partie des articles, des mesures, des critiques, etc. 🙂 ! Ce n'est de loin pas "tout réduire aux biais", c'est montrer ce qu'ils peuvent expliquer de nos raisonnement, et de façon qualitative, j'ai bien vu que pendant la pandémie, certains biais de raisonnement probabilistes (y'a moins de surmortalité, y'a des vaccinés aux urgences) menaient tout droit au complotisme (en parallèle à des facteurs sociaux, méfiance, précarité, etc.).`,
            }),
            createComment({
              id: 'ddijer',
              author: Astrocept,
              text: `Sade bien sûr que les vulgarisateurs ne connaissent rien aux biais par rapport à des chercheurs 😉 et aussi parce qu'ils ne viennent pas de ces disciplines-là, en général. C'est pourquoi ils doivent en être conscients. C'est pourquoi aussi il serait bien que des universités, voire l'Etat, envisagent de nous former en se rendant compte du nombre de personnes qu'on touche sans frais pour l'Etat, justement... Tu ne penses pas ?`,
            }),
            createComment({
              id: '3vi2yz',
              author: Sade,
              text: `Astrocept Pas rien, la plupart des vulgarisateurs disent des choses que les spécialistes admettraient (et il y a aussi des psychologues qui se recyclent dans les biais parce que c'est populaire sans bien connaître 😉 ) ! Ce sont aussi apparemment plutôt les critiques qui ne savent pas bien de quoi ils et elles parlent... Et oui, bien sûr, c'est vous qui touchez le plus de monde, d'où le fait qu'il faut des vidéos et des livres sur les recherches empiriques sur le sujet !`,
            }),
          ],
        }),
        createComment({
          id: '7azsus',
          author: Sade,
          text: `Voltaire Si tu veux que je sois plus précis dans ma critique, je changerais passablement les qualificatifs que tu utilises dans ton post : "Expliquer le comportement de quelqu'un ou ses choix en se basant sur des biais cognitifs est extrêmement réducteur et caricatural" : non, ce n'est pas extrêmement réducteur et caricatural. Il y a certains choix et certains comportement qui sont certainement en grande partie dus aux biais cognitifs, ce n'est pas une affaire de décalration mais de recherche. "Aucun psychologue cognitiviste n'utilise ce genre d'explications qu'on trouve parfois chez les rationalistes". On peut statistiquement contrôler l'effet des variables sociales, et regarder si les biais cognitifs expliquent encore une partie de la variance. Par exemple, dans notre étude sur les Gilets Jaunes, on peut contrôler toutes les variables sociales (comme le niveau d'éducation, le salaire, etc.) et constater qu'il y a toujours une corrélation entre croyances aux complots et au paranormal ; cela suggère au moins une explication en termes cognitifs, et du moins ce sera une question à répondre avec des études empiriques :

"Vous croyez au paranormal? Biais cognitifs... Vous êtes radicalisé? Biais cognitifs... " : il y a des études scientifiques qui le suggèrent (que c'est en partie dus à certains biais), donc si on veut démontrer le contraire, on ne peut le faire que par des études scientifiques.

"Les biais ne sont qu'une minuscule pièce du puzzle des "cognitions". Pour comprendre le comportement et les choix, il faut connaitre l'histoire d'une personne, sa vision du monde, l'histoire de son groupe social, les rapports de pouvoirs et les discriminations dans lesquelles ce groupe est pris, la culture ambiante, la situation économique, etc etc... Y a pleins de critères à prendre en compte." : ce n'est pas affaire de croyance, mais d'études empiriques (le "minuscule" aussi, cela peut se calculer comme je le disais statistiquement, mais cela ne peut pas se décréter comme "immense" ni "minuscule".

"Si vous voyez quelqu'un expliquer un comportement par des biais cognitifs, vous êtes face à un réductionnisme extrême, et vous pouvez déjà tirer comme conclusion que la personne en question ne comprend pas grand chose à la psychologie humaine." Donc tu veux dire que certains psychologues reconnus comme Stanovich, Pennycook, Kahneman, etc. ne "comprennent pas grand chose à la psychologie humaine ?" Je ne sais pas si tu vois comme moi la force (pour ne pas dire l'énormité) de l'affirmation ??

"Malheureusement, certains sceptiques et rationalistes donnent bcps trop de place à ces biais cognitifs" : encore une fois, juger la place des biais ne se décide pas, c'est une affaire de recherche. "Les biais peuvent expliquer certains erreurs de perception assez bien, mais pas vraiment les attitudes des gens" : Là je peux t'envoyer les travaux sur les biais cognitifs et les croyances, y'en a des dizaines. Donc bref, je pense que la position la plus rationnelle est que les biais, comme les variables sociales, expliquent une part des décisions et des comportements humains, mais il faut pour moi être prudent dans tous les sens, et attendre des recherches (et se baser pour l'instant à celles existantes) pour juger de leur importance relative. Ton post et la critique zet-éthique sont pour moi des critiques bien sûr en partie vraie mais exagérées, et pas assez basées sur les travaux en psychologie.`,
          replies: [
            createComment({
              id: 'x9upkk',
              author: Voltaire,
              text: `Sade en fait je me reconnais dans tout ce que tu écris et ça me semble très intéressant...

Quand moi je lis les billets de ZEM sur les biais, ce que j'en retiens c'est une critique de l'usage des biais par les rationalistes, qui sont en très large majorité des amateurs et pas de psychologues ou autres experts. La critique que j'ai retenu vise surtout l'usage caricatural fait par les amateurs, et pas la remise en question du champ même des biais cognitifs, en lien avec toutes les études et les critiques et contre critiques dont tu parles. On a pas du avoir la même lecture de la série de billets sur les biais cognitifs de ZEM du coup

Je maintiens donc ce que j'ai dit plus haut, et je ne crois pas que des chercheurs en psychologie cognitive font souvent ce que je reproche ici : réduire toute l'explication du comportement d'un individu à un ou des biais cognitifs.

Pour moi ce sont les sceptiques qui sont visés et pas les chercheurs dont tu parles`,
            }),
            createComment({
              id: 'etyre9',
              author: Sade,
              text: `Voltaire Oui alors si cette série ZEM est sur l'utilisation du concept de biais par les rationalistes (mais bon qu'elle soit écrite par des gens qui ne citent pas la littérature scientifique sur la question, moi ça me gêne énormément), ce n'est peut-être alors pas la bonne réponse à la question de Hegel, qui demandait selon ce que j'ai compris des informations sur la littérature scientifique sur les biais, et sur les critiques non pas de l'utilisation du concept mais des travaux eux-mêmes (donc Gigerenzer et les autres). Mais c'est vrai que du coup, je ne connais pas de vidéo qui exposerait certains biais, comment on les mesure, et leur critique par les gens du domaine... D'où mon idée de vidéo, mais ça pourrait être long 😃`,
            }),
          ],
        }),
      ],
    }),
    createComment({
      id: 'o7ihv3',
      author: GeraldBronner,
      upvotes: 10,
      downvotes: 0,
      text: `Je me permets d indiquer qu il y a une quinzaine d années j ai publié ceci. Un livre qui aborde de façon critique certaines interprétations trop rapides des notions d heuristique et de biais cognitifs. A part cela je suis d accord avec les indications de Sade.
[https://www.puf.com/content/Lempire_de_lerreur](https://www.puf.com/content/Lempire_de_lerreur)`,
    }),
  ],
});
