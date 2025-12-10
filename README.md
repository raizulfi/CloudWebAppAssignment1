# Next.js Project

This project was created with [Next.js](https://nextjs.org) using [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

Edit `app/page.tsx` to update the page — it auto-refreshes as you save changes.

## Tests

Playwright is set up for UI and API flows.

- Install Playwright browsers once: `npx playwright install`
- Run all tests (headless): `npm run test:e2e`
- Run in headed mode: `npm run test:e2e:headed`
- View the HTML report after a run: `npx playwright show-report`

API coverage lives in `tests/e2e/api.spec.ts`; UI navigation smoke lives in `tests/e2e/navigation.spec.ts`.

## Learn More

* [Next.js Docs](https://nextjs.org/docs)
* [Next.js Tutorial](https://nextjs.org/learn)
* [Next.js GitHub](https://github.com/vercel/next.js)

## Deploy

Deploy easily with [Vercel](https://vercel.com/new?filter=next.js).

## Acknowledgment

This project was built with the help of AI for coding assistance.
