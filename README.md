# bidriart.com

An ecommerce store for Bidri art, with stories about the craft and its artisans.

Built with Next.js, TypeScript, Tailwind CSS, Prisma and PostgreSQL. Payments run through Razorpay.

## Getting started

You need Node.js and Docker Desktop.

```bash
npm install
cp .env.example .env.local
```

In `.env.local`, fill in `BETTER_AUTH_SECRET` and `ADMIN_PASSWORD`, then:

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Then open http://localhost:3000. The admin panel is at /admin, and you log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

In development, payments use a local stand-in (`RAZORPAY_MOCK=true`), and emails are saved in `.dev-emails/`.

## Tests

```bash
docker exec bidri-artisans-academy-postgres-1 psql -U bidri -d bidri -c "CREATE DATABASE bidri_test"
DATABASE_URL=postgresql://bidri:bidri_local@localhost:5432/bidri_test npx prisma migrate deploy
npm test
npx playwright install chromium
npx playwright test
```

## Docs

All plans, decisions and tasks live in [docs/](docs/README.md). Start there.
