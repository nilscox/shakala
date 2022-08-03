import { RequestContext } from '@mikro-orm/core';
import { CreateThreadCommand, GetUserByEmailQuery, SignupCommand } from 'backend-application';
import { User } from 'backend-domain';

import { Server } from '../../server';

const text = `Hello tout le monde

Parmi la communauté zététique je n'apprends rien à personne en parlant du fait qu'une des bases des outils qu'on manie sont les biais cognitifs.

Et je vois souvent des personnes issues du joli monde des sciences humaines rappeler qu'il y a tout un état de l'art, des ressources etc et que connaître seul les biais cognitifs avec zéro connaissance du contexte autour, du fonctionnement du cerveau et toutes choses égales par ailleurs que je ne connais pas moi même, ignorante du sujet que je suis, ne permet pas une lecture complète des choses.

J'aurai aimé avoir des explications sur : dans quoi s'ancrent comme disciplines etc les biais cognitifs ? Quelles sont les évolutions, remises en questions et critiques s'il y a ?

Je serais aussi preneuse de ressources, quelles soient sous forme de livre, articles podcast, vidéos etc

Merci d'avance de vos retours`;

const seed = async () => {
  const server = new Server();

  try {
    await server.init();

    await RequestContext.createAsync(server.orm.em, async () => {
      await server.commandBus.execute(new SignupCommand('user', 'user@email.tld', 'p4ssword'));

      const user = await server.queryBus.execute<User>(new GetUserByEmailQuery('user@email.tld'));

      await server.queryBus.execute(new CreateThreadCommand(user.id, text));
    });
  } finally {
    await server.close();
  }
};

seed().catch(console.error);
