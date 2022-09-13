import {
  CreateThreadCommand,
  ExecutionContext,
  GetUserByEmailQuery,
  SignupCommand,
} from 'backend-application';
import { User } from 'backend-domain';

import { Application } from '../../application';

const text = `Bonjour,

Je me demande parfois à quel point les perceptions de différentes personnes... diffèrent.

Je veux dire, ce qui se passe dans notre tête ne peut pas être communiqué avec une exactitude parfaite. Rien que le fait de devoir employer des mots pour décrire nos expériences de *notre réalité* va nous faire perdre en précision. Et puis, la personne à qui on raconte notre vie va devoir se mettre à notre place du mieux qu'elle peut, mais est-ce que c'est toujours possible ?

Un exemple que j'aime bien prendre pour illustrer cette idée, c'est ce qu'il se passe lorsqu'on ouvre les yeux le matin. Moi, je mets du temps à "émerger", quelque minutes pour être pleinement conscient (pour être avoir fini de me réveiller). Ma copine en revanche, est entièrement consciente en quelques secondes à peine.

Et ça peut poser des quiproquos : elle me dit "mais si, je t'en ai parlé ce matin après qu'on se soit réveillé !", et moi j'ai aucun souvenir de ce qu'on s'est dit à ce moment là...

D'où ma réflexion : si on n'avait pas discuté de cette différence d'expérience du réveil, il serait naturel de penser que c'est pareil pour tout le monde, que c'est **comme on le vit sois-même**.

Est-ce que vous avez déjà pensé à ce genre de chose ? D'autres situations dans lesquelles on pense que tout le monde vit la même chose, alors que pas du tout ?
`;

const seed = async () => {
  const app = new Application();

  try {
    await app.init();

    await app.run(async ({ commandBus, queryBus }) => {
      // cspell:word p4ssword
      await commandBus.execute(
        new SignupCommand('user', 'user@email.tld', 'p4ssword'),
        new ExecutionContext(undefined),
      );

      const user = await queryBus.execute<User>(new GetUserByEmailQuery('user@email.tld'));

      await commandBus.execute(new CreateThreadCommand('description', text, []), new ExecutionContext(user));
    });
  } finally {
    await app.close();
  }
};

seed().catch(console.error);
