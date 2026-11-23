# Playwright QA Automation Framework (Demo)

[![Playwright Tests](https://github.com/katiachaparropy/Saucedemo-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/katiachaparropy/Saucedemo-playwright/actions/workflows/playwright.yml)

A production-style test automation framework built with **Playwright + TypeScript** using the **Page Object Model**.
It covers UI end-to-end tests on a demo e-commerce site and API tests on a demo REST API, and runs on every push with GitHub Actions.

Built by **Katia Chaparro**, Senior QA Engineer, to show how I structure maintainable automation for client projects.

## What it covers

| Area | Target | Tests |
|---|---|---|
| UI – Login | [SauceDemo](https://www.saucedemo.com) | Valid login, locked user, data-driven validation errors, protected routes |
| UI – Inventory | SauceDemo | Sorting by price and name, cart badge add/remove |
| UI – Checkout | SauceDemo | Full purchase flow, total = subtotal + tax, required field validation |
| API – Booking | [Restful Booker](https://restful-booker.herokuapp.com) | Auth, create, read, partial update, unauthorized update, delete |

UI tests run on **Chromium, Firefox and WebKit**.

## Tech stack

- Playwright Test + TypeScript
- Page Object Model with custom fixtures (including a logged-in fixture)
- Data-driven tests and centralized test data
- Stable `data-test` selectors via `getByTestId`
- HTML report, screenshots, videos and traces on failure
- GitHub Actions CI with retries and report artifacts

## Project structure

```
├── .github/workflows/playwright.yml   # CI pipeline
├── fixtures/test-fixtures.ts          # Page object fixtures + logged-in state
├── pages/                             # Page Object Model
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/users.ts                 # Users, customer and product data
├── tests/
│   ├── ui/                            # login, inventory, checkout
│   └── api/                           # booking CRUD
└── playwright.config.ts               # Browser and API projects
```

## Run locally

```bash
npm install
npx playwright install
npm test              # all tests
npm run test:ui       # UI tests on 3 browsers
npm run test:api      # API tests
npm run test:smoke    # @smoke tagged tests only
npm run report        # open the HTML report
```

## Contact

Available for QA projects on Upwork: manual testing, test automation, API and mobile testing, fintech flows (KYC, OTP, OCR, payments).
