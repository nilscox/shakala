import { expect, test } from '@playwright/test';

import { AppContext } from '../utils/app-context';

test.describe('Authentication', () => {
  let app: AppContext;

  test.beforeAll(async ({ browser }) => {
    app = await AppContext.create(browser);
  });

  test.beforeEach(async () => {
    await app.clearDatabase();
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

    const notification = app.closest(app.findByText(/Bienvenue !/), '.notification');

    await expect(notification).toBeVisible();
    await expect.poll(() => app.searchParams.get('auth')).toBeNull();

    app.within(notification).findByLabel('Fermer').click();

    await app.findLink('user').click();
    await app.findButton('Déconnexion').click();

    await expect(app.findByText("Vous n'êtes maintenant plus connecté(e)")).toBeVisible();

    await app.within(app.locator('header')).findByText('Connexion').click();
    await app.findByPlaceholder('Email').fill('user@domain.tld');
    await app.findByPlaceholder('Mot de passe').fill('password');
    await app.findButton('Connexion').click();

    await expect(app.findByText('Vous êtes maintenant connecté(e)')).toBeVisible();
  });
});
