import { expect, test } from '@playwright/test';

import { AppContext } from '../utils/app-context';

test.describe('Authentication', () => {
  let app: AppContext;

  test.beforeAll(async ({ browser }) => {
    app = await AppContext.create(browser);
  });

  test.beforeEach(async () => {
    await app.clearDatabase();
    await app.clearEmails();
  });

  test('As a user, I can signup, logout and log back in', async () => {
    await app.navigate('/');

    await app.within(app.locator('header')).findByText('Connexion').click();
    await expect(app.searchParams.get('auth')).toEqual('login');

    await app.findByText('Créer un compte').click();
    await expect(app.searchParams.get('auth')).toEqual('signup');

    await app.findByPlaceholder('Email').fill('user@domain.tld');
    await app.findByPlaceholder('Mot de passe').fill('password');
    await app.findByPlaceholder('Pseudo').fill('user');
    await app.findByText(/J'accepte la charte/).click();
    await app.findByText(/J'accepte la charte/).click();
    await app.findButton('Inscription').click();

    const notification = app.findNotification(
      /^Votre compte a bien été créé ! .* à l'adresse user@domain.tld.$/,
    );

    await expect(notification).toBeVisible();
    await expect.poll(() => app.searchParams.get('auth')).toBeNull();

    app.within(notification).findByLabel('Fermer').click();

    const page = await app.newPage();
    await page.navigate(await app.getEmailValidationLink('user@domain.tld'));

    expect(page.findNotification('Votre adresse email a bien été validée. Bienvenue ! 🎉')).toBeVisible();

    await app.findLink('user').click();
    await app.findButton('Déconnexion').click();

    await expect(app.findNotification("Vous n'êtes maintenant plus connecté(e)")).toBeVisible();

    await app.within(app.locator('header')).findByText('Connexion').click();
    await app.findByPlaceholder('Email').fill('user@domain.tld');
    await app.findByPlaceholder('Mot de passe').fill('password');
    await app.findButton('Connexion').click();

    await expect(app.findNotification('Vous êtes maintenant connecté(e)')).toBeVisible();
  });

  test('As a user, I see a clear error message when my password is invalid', async () => {
    const nick = 'user';
    const { email } = await app.credentials(nick);

    await app.createUser(nick);
    await app.validateEmailAddress(email);
    await app.navigate('/');

    await app.within(app.locator('header')).findByText('Connexion').click();
    await expect(app.searchParams.get('auth')).toEqual('login');

    await app.findByPlaceholder('Email').fill(email);
    await app.findByPlaceholder('Mot de passe').fill('nope');
    await app.findButton('Connexion').click();

    await app.findByText('Combinaison email / mot de passe non valide').click();
  });
});
