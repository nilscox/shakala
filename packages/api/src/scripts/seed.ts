import { module as commonModule, StubConfigAdapter, TOKENS } from '@shakala/common';
import { assert, ReactionType, wait } from '@shakala/shared';
import { createComment, createThread, setReaction } from '@shakala/thread';
import { createUser as createUserCommand, validateUserEmail } from '@shakala/user';
import { USER_TOKENS } from '@shakala/user/dist/tokens';
import dotenv from 'dotenv';

import { container } from '../container';
import { Application } from '../infrastructure/application';

dotenv.config();

seed().catch(console.error);

// cspell:disable

const thread = `<p>Bonjour,</p>

<p>Dans <a href="https://www.youtube.com/watch?v=3MJJvXGuDag">cette vidéo</a> sur la chaîne YouTube Science Étonnantes, David Louapre explique qu'il existe une longueur minimale dans l'espace, la longueur de Planck.</p>

<p>Est-ce qu'on pourrait en dire de même pour le temps (est-ce qu'il existe une <em>"durée minimale"</em>) ?</p>`;

const comment = `<p>Il existe bien une durée minimale qu'on appelle <a href="https://fr.wikipedia.org/wiki/Temps_de_Planck">le temps de Planck</a>, et qui vaut environ <strong>10<sup>-43</sup> seconde</strong>.</p>`;

async function seed() {
  const app = new Application();

  const logger = container.get(TOKENS.logger);
  logger.tag = 'Seed';

  container.use(TOKENS.config).from(commonModule);

  const config = new StubConfigAdapter(container.get(TOKENS.config));
  config.database.allowGlobalContext = true;
  commonModule.bind(TOKENS.config).toConstant(config);

  try {
    await app.init();

    const generator = container.get(TOKENS.generator);
    const commandBus = container.get(TOKENS.commandBus);
    const userRepository = container.get(USER_TOKENS.repositories.userRepository);

    const createUser = async (nick: string) => {
      const userId = await generator.generateId();

      logger.info(`Creating user ${nick} (${userId})`);

      await commandBus.execute(
        createUserCommand({
          userId,
          nick,
          email: `${nick.toLowerCase()}@email.tld`,
          password: 'p4ssword',
        })
      );

      const user = await userRepository.findById(userId);
      assert(user);

      await commandBus.execute(
        validateUserEmail({ userId, emailValidationToken: user.emailValidationToken })
      );

      return user.id;
    };

    const joe = await createUser('Joe');
    const jack = await createUser('Jack');
    const william = await createUser('William');
    const avrell = await createUser('Avrell');

    await createUser('nilscox');
    await createUser('bopzor');

    const threadId = await generator.generateId();
    logger.info(`creating thread ${threadId}`);
    await commandBus.execute(
      createThread({ description: 'description', threadId, authorId: jack, keywords: [], text: thread })
    );

    const commentId = await generator.generateId();
    logger.info(`creating comment ${commentId}`);
    await commandBus.execute(createComment({ commentId, threadId, authorId: william, text: comment }));

    for (const userId of [joe, jack, avrell]) {
      logger.info(`creating reaction from ${userId} on ${commentId}`);
      await commandBus.execute(setReaction({ commentId, userId, reactionType: ReactionType.upvote }));
    }

    // wait for all events to finish
    await wait(200);
  } catch (error) {
    console.error(error);
  } finally {
    await app.close();
    process.exit(0);
  }
}
