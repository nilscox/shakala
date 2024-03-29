import { expect, test } from '@playwright/test';

import { AppContext } from '../utils/app-context.js';
import { clearDatabase } from '../utils/database.js';
import { clearEmails, validateEmailAddress } from '../utils/emails.js';

// cspell:words alice
test.describe('Comments', () => {
  let alice: AppContext;
  let bob: AppContext;
  let charlie: AppContext;

  test.beforeAll(async ({ browser }) => {
    alice = await AppContext.create(browser);
    bob = await AppContext.create(browser);
    charlie = await AppContext.create(browser);

    await clearDatabase();
    await clearEmails();
  });

  const login = async (app: AppContext, nick: string) => {
    await app.navigate('/');

    const { email, password } = app.credentials(nick);

    await app.createUser(nick);
    await app.login(email, password);
  };

  const texts = {
    thread: "J'ai entendu dire que la terre serait plate, est-ce que c'est sérieux ?",
    comment: "C'est vrai, j'en ai entendu parlé sur Twitter !",
    reply: "C'est faux.\n\nPour être exacte, la forme de la terre est un ellipsoïde.",
  };

  test('As a user, I can create a thread and engage with other users', async () => {
    await login(alice, 'Alice');
    await login(bob, 'Bobby');

    await alice.navigate('/discussions');

    await alice.findByText('Description').fill('La terre est-elle plate ?');
    await alice.findByText('Mots-clés').fill('terre plate');
    await alice.findByText('Texte').fill(texts.thread);
    await alice.findButton('Créer').click();

    await expect.poll(() => alice.url.pathname).toMatch(/discussions\/[a-zA-Z0-9]+$/);

    await charlie.navigate(alice.url);
    await expect(charlie.findByText("Aucun commentaire n'a été publié pour le moment.")).toBeVisible();

    await bob.navigate(alice.url);
    await bob.findByPlaceholder('Répondre à Alice').fill(texts.comment);
    await bob.findButton('Envoyer').click();

    await charlie.reload();
    await expect(charlie.findByText(/sur Twitter !$/)).toBeVisible();
  });

  test('As an unauthenticated user, I can signup to reply to a comment', async () => {
    const comment = charlie.findComment(/sur Twitter !$/);

    await charlie.findByPlaceholder('Répondre').focus();
    await charlie.findByPlaceholder('Rédigez votre message').fill(texts.reply);

    const waitDebounceTime = 1000 + 100;
    await new Promise((r) => setTimeout(r, waitDebounceTime));

    await charlie.within(comment).findButton('Envoyer').click();

    await charlie.findByText('Créer un compte').click();
    await charlie.findByPlaceholder('Email').fill('charlie@domain.tld');
    await charlie.findByPlaceholder('Mot de passe').fill('password');
    await charlie.findByPlaceholder('Pseudo').fill('Charlie');
    await charlie.findByText(/J'accepte la charte/).click();
    await charlie.findByText(/J'accepte la charte/).click();

    await charlie.findButton('Inscription').click();
    await expect.poll(() => charlie.searchParams.get('auth')).toBeNull();

    await validateEmailAddress('charlie@domain.tld');

    await charlie.within(comment).findButton('Envoyer').click();

    await alice.reload();
    await expect(alice.findByText(/la terre est un ellipsoïde.$/)).toBeVisible();
  });

  test('As a user, I can report a comment', async () => {
    const comment = alice.closest(alice.findByText(/sur Twitter !$/), '.comment > *');

    await alice.within(comment).findByTitle('Voir plus...').click();
    await alice.within(comment).findButton('Signaler').click();

    await alice
      .findByPlaceholder('Précisez le motif du signalement si nécessaire')
      .fill("Il dit n'importe quoi.");

    await alice.findButton('Signaler').click();

    await expect(
      alice.findNotification('Votre signalement a bien été remonté. Merci pour votre contribution !')
    ).toBeVisible();
  });
});
