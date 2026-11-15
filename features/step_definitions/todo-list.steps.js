const assert = require('node:assert/strict');
const { Given, When, Then } = require('@cucumber/cucumber');

Given('que abro la aplicación', async function () {
  await this.page.goto(this.baseUrl);
});

When('navego a {string} desde el menú {string}', async function (pageName, menuName) {
  await this.page.getByRole('button', { name: menuName, exact: true }).click();
  await this.page.getByRole('button', { name: pageName, exact: true }).click();
});

When('añado la tarea {string}', async function (task) {
  const input = this.page.locator('input').first();
  await input.fill(task);
  await input.press('Enter');
});

Then('veo el encabezado {string}', async function (heading) {
  const headingLocator = this.page.getByRole('heading', { name: heading, exact: true });
  await headingLocator.waitFor({ state: 'visible' });
  assert.equal(await headingLocator.isVisible(), true);
});

Then('veo la tarea {string}', async function (task) {
  const taskLocator = this.page.locator('li').filter({ hasText: task }).first();
  await taskLocator.waitFor({ state: 'visible' });
  assert.equal(await taskLocator.isVisible(), true);
});
