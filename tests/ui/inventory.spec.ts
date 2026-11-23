import { test, expect } from '../../fixtures/test-fixtures';
import { products } from '../../test-data/users';

test.describe('Inventory', () => {
  test('sorts products by price, low to high', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');

    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts products by price, high to low', async ({ loggedIn }) => {
    await loggedIn.sortBy('hilo');

    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('sorts products by name, Z to A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');

    const names = await loggedIn.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('cart badge updates when adding and removing items @smoke', async ({ loggedIn }) => {
    await loggedIn.addToCart(products.backpack);
    await loggedIn.addToCart(products.bikeLight);
    await expect(loggedIn.cartBadge).toHaveText('2');

    await loggedIn.removeFromCart(products.backpack);
    await expect(loggedIn.cartBadge).toHaveText('1');

    await loggedIn.removeFromCart(products.bikeLight);
    await expect(loggedIn.cartBadge).toBeHidden();
  });
});
