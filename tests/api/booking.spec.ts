import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * CRUD tests for the public Restful Booker API.
 * Admin credentials below are the public demo values documented by the API.
 */
const newBooking = {
  firstname: 'Ana',
  lastname: 'Gomez',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  additionalneeds: 'Breakfast',
};

async function getToken(request: APIRequestContext): Promise<string> {
  const res = await request.post('/auth', { data: { username: 'admin', password: 'password123' } });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.token).toBeTruthy();
  return body.token;
}

test.describe.serial('Booking API', () => {
  let bookingId: number;
  let token: string;

  test.beforeAll(async ({ request }) => {
    token = await getToken(request);
  });

  test('health check responds @smoke', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('creates a booking @smoke', async ({ request }) => {
    const res = await request.post('/booking', { data: newBooking });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.bookingid).toEqual(expect.any(Number));
    expect(body.booking).toMatchObject(newBooking);
    bookingId = body.bookingid;
  });

  test('gets the created booking', async ({ request }) => {
    const res = await request.get(`/booking/${bookingId}`);

    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject(newBooking);
  });

  test('partially updates the booking with a valid token', async ({ request }) => {
    const res = await request.patch(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
      data: { totalprice: 200, additionalneeds: 'Late checkout' },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.totalprice).toBe(200);
    expect(body.additionalneeds).toBe('Late checkout');
    expect(body.firstname).toBe(newBooking.firstname);
  });

  test('rejects an update without a token', async ({ request }) => {
    const res = await request.patch(`/booking/${bookingId}`, { data: { totalprice: 1 } });
    expect(res.status()).toBe(403);
  });

  test('deletes the booking', async ({ request }) => {
    const del = await request.delete(`/booking/${bookingId}`, { headers: { Cookie: `token=${token}` } });
    expect(del.status()).toBe(201);

    const get = await request.get(`/booking/${bookingId}`);
    expect(get.status()).toBe(404);
  });
});

test('rejects auth with wrong credentials', async ({ request }) => {
  const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
  const body = await res.json();
  expect(body.token).toBeUndefined();
  expect(body.reason).toBe('Bad credentials');
});
