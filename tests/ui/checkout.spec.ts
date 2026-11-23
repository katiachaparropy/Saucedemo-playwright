import { test, expect } from '../../fixtures/test-fixtures';
import { customer, products } from '../../test-data/users';

test.describe('Checkout', () => {
  test('user completes a purchase end to end @smoke', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart(products.backpack);
    await loggedIn.addToCart(products.boltTShirt);
    await loggedIn.openCart();

    expect(await cartPage.getItemNames()).toEqual([products.backpack, products.boltTShirt]);
    await cartPage.checkout();

    await checkoutPage.fillCustomerInfo(customer);
    await expect(checkoutPage.title).toHaveText('Checkout: Overview');

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('order total equals item total plus tax', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart(products.backpack);
    await loggedIn.addToCart(products.bikeLight);
    await loggedIn.openCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomerInfo(customer);

    const itemTotal = await checkoutPage.amountOf(checkoutPage.itemTotal);
    const tax = await checkoutPage.amountOf(checkoutPage.tax);
    const total = await checkoutPage.amountOf(checkoutPage.total);

    expect(itemTotal).toBeCloseTo(29.99 + 9.99, 2);
    expect(total).toBeCloseTo(itemTotal + tax, 2);
  });

  const missingFields = [
    { field: 'first name', data: { ...customer, firstName: '' }, error: 'First Name is required' },
    { field: 'last name', data: { ...customer, lastName: '' }, error: 'Last Name is required' },
    { field: 'postal code', data: { ...customer, postalCode: '' }, error: 'Postal Code is required' },
  ];

  for (const c of missingFields) {
    test(`cannot continue without ${c.field}`, async ({ loggedIn, cartPage, checkoutPage }) => {
      await loggedIn.addToCart(products.backpack);
      await loggedIn.openCart();
      await cartPage.checkout();

      await checkoutPage.fillCustomerInfo(c.data);
      await expect(checkoutPage.errorMessage).toContainText(c.error);
    });
  }
});
