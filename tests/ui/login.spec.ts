import { test, expect } from '../../fixtures/test-fixtures';
import { users } from '../../test-data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in @smoke', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('locked out user sees an error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  const invalidCases = [
    { name: 'empty username', username: '', password: 'secret_sauce', error: 'Username is required' },
    { name: 'empty password', username: 'standard_user', password: '', error: 'Password is required' },
    { name: 'wrong password', username: 'standard_user', password: 'wrong', error: 'do not match any user' },
  ];

  for (const c of invalidCases) {
    test(`shows validation error for ${c.name}`, async ({ loginPage }) => {
      await loginPage.login(c.username, c.password);
      await expect(loginPage.errorMessage).toContainText(c.error);
    });
  }

  test('protected page redirects to login when not authenticated', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('only access');
  });
});
