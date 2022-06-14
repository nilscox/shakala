import { createThread, createUser } from 'backend-application';
import { CommentAuthor } from 'backend-domain';

const author = CommentAuthor.create(createUser({ nick: 'Chou chou' }));

const thread = createThread({
  id: 'choucroute',
  author,
  text: `La choucroute est un mets composé de chou coupé finement et transformé par lacto-fermentation dans une saumure, généralement accompagné de garniture.

C'est un plat qui se consomme traditionnellement avec des variantes locales : en Allemagne, Autriche, Belgique, Bosnie, Bulgarie, Estonie, France, Hongrie, Lettonie, Lituanie, au Luxembourg, en Pologne, en Biélorussie, aux Pays-Bas, République tchèque, Roumanie, Russie, Serbie, Slovaquie, Suisse, dans le sud du Brésil, au Chili, aux États-Unis, en République populaire de Chine (et aussi, plus généralement, mais non de manière exclusive, par des populations issues des vagues d'immigration allemandes et germaniques, ainsi, par exemple, en Namibie1,2).`,
});

export default {
  thread,
  comments: [],
};
