import { Locator, Page } from '@playwright/test';

export class AppAccessors {
  constructor(protected _locator: Page | Locator) {}

  locator = this._locator.locator.bind(this._locator);

  closest(locator: Locator, selector: string) {
    return this.locator(selector, { has: locator });
  }

  within(locator: Locator) {
    return new AppAccessors(locator);
  }

  findByText(text: string | RegExp) {
    if (typeof text === 'string') {
      return this.locator(`text="${text}"`);
    } else {
      return this.locator(`text=${text}`);
    }
  }

  findByPlaceholder(text: string) {
    return this.locator(`[placeholder="${text}"]`);
  }

  findByLabel(text: string) {
    return this.locator(`[aria-label="${text}"]`);
  }

  findByTitle(text: string) {
    return this.locator(`[title="${text}"]`);
  }

  findButton(text: string) {
    return this.locator('button', { hasText: text });
  }

  findLink(text: string) {
    return this.locator('a', { hasText: text });
  }

  findNotification(text: string | RegExp) {
    return this.closest(this.findByText(text), '.notification');
  }
}
