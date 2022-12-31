import {
  CreateCommentCommand,
  CreateThreadCommand,
  ExecutionContext,
  GetUserByIdQuery,
  SetReactionCommand,
  SignupCommand,
  ValidateEmailAddressCommand,
} from '@shakala/backend-application';
import { ReactionType, User } from '@shakala/backend-domain';
import { wait } from '@shakala/shared';

import { Application } from '../../application';

// cspell:disable

const thread = `Bonjour,

Dans [cette vidéo](https://www.youtube.com/watch?v=3MJJvXGuDag) sur la chaîne YouTube Science Étonnantes, David Louapre explique qu'il existe une longueur minimale dans l'espace, la longueur de Planck.

Est-ce qu'on pourrait en dire de même pour le temps (est-ce qu'il existe une "durée minimale") ?`;

const comment = `Il existe bien une durée minimale qu'on appelle [le temps de Planck](https://fr.wikipedia.org/wiki/Temps_de_Planck), et qui vaut environ 10^-43 seconde.`;

const seed = async () => {
  const app = new Application();

  try {
    await app.init();

    await app.run(async ({ commandBus, queryBus }) => {
      const createUser = async (nick: string) => {
        const userId = await commandBus.execute<string>(
          new SignupCommand(nick, nick.toLowerCase() + '@email.tld', 'p4ssword'),
          ExecutionContext.unauthenticated,
        );

        const user = await queryBus.execute<User>(new GetUserByIdQuery(userId));

        await commandBus.execute(
          new ValidateEmailAddressCommand(userId, user.emailValidationToken as string),
          ExecutionContext.unauthenticated,
        );

        // re-query to return the user without email validation token
        return queryBus.execute<User>(new GetUserByIdQuery(userId));
      };

      const joe = await createUser('Joe');
      const jack = await createUser('Jack');
      const william = await createUser('William');
      const avrell = await createUser('Avrell');

      await createUser('nilscox');
      await createUser('bopzor');

      const threadId = await commandBus.execute<string>(
        new CreateThreadCommand('description', thread, []),
        new ExecutionContext(jack),
      );

      const commentId = await commandBus.execute<string>(
        new CreateCommentCommand(threadId, null, comment),
        new ExecutionContext(william),
      );

      for (const user of [joe, jack, avrell]) {
        await commandBus.execute<string>(
          new SetReactionCommand(commentId, ReactionType.upvote),
          new ExecutionContext(user),
        );
      }
    });

    // wait for all events to finish
    await wait(200);
  } finally {
    await app.close();
  }
};

seed().catch(console.error);
