# 💰 RupeeMate

**A private, browser-based expense tracker for India.** Log expenses in rupees, set monthly budgets and see where your money goes. No signup, and your data never leaves your browser.

RupeeMate is a learning project by a 1st year MCA student, built to practise full-stack development with a real, usable app.

---

## ✅ What works today

| Area | What you can do |
| --- | --- |
| **Expenses** | Add expenses in Basic or Advanced mode (sub-category, payment method, tags, location, notes), search, filter by category / payment method / date range, sort, delete |
| **Dashboard** | Total, this month vs last month, average per day, category breakdown, recent activity |
| **Analytics** | 6-month trend, spend by category and payment method, top 5 expenses |
| **Categories** | Totals per category and sub-category |
| **Budget** | Overall monthly limit and optional per-category limits, with progress and over-budget warnings |
| **Settings** | Export to CSV, download / restore a JSON backup, delete all data |
| **Privacy** | See [/privacy](app/privacy/page.tsx): no accounts, no analytics, no cookies |

### Where your data lives

Everything is saved in your browser's `localStorage` (keys `rupeemate_expenses_v1` and `rupeemate_budget_v1`). There is no server database yet, so data is **not** shared between devices, and clearing site data or using a private window deletes it. Use **Settings → Download backup** regularly.

### Not built yet

- **Receipts** (attach / scan) needs file storage and OCR. The page says so honestly.
- **Accounts, sync between devices, bill splitting and settlement.** The "Shared with" field is only a note, and amounts are not divided.
- **Recurring expenses** are labelled but not added automatically.

---

## 🛠️ Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack) with the React Compiler
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (strict)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) icons
- [Vitest](https://vitest.dev/) for unit tests

---

## 🚀 Getting started

**Prerequisites:** Node.js 20.9 or newer.

```bash
npm install
npm run dev       # http://localhost:3000
```

### Scripts

```bash
npm run dev        # development server with hot reload
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript, no emit
npm test           # unit tests
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests and the build on every push to `main` and every pull request.

---

## 📁 Project structure

```
app/                  Routes (App Router): /, /expenses, /dashboard, /analytics,
                      /categories, /budget, /settings, /receipts, /privacy
components/           UI: layout shell, form, sidebar, toast, shared cards
  AppDataProvider.tsx   single source of truth for expenses + budget (localStorage)
lib/
  expenses.ts         types, categories, date maths, aggregation, parsing, CSV
  local-store.ts      localStorage store for useSyncExternalStore
  download.ts         browser file download helper
tests/                unit tests for lib/
```

Dates are stored as plain `YYYY-MM-DD` strings and compared as local calendar days (never through `toISOString()`, which is UTC and would shift the day for users in India).

---

## 🌐 Deploying

The app is fully static (every route is prerendered) and needs **no environment variables**.

**Vercel (simplest):** import the GitHub repository, keep the defaults (framework: Next.js, build command `npm run build`) and deploy.

Any Node host also works: `npm run build` then `npm run start`.

Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) are set in [next.config.ts](next.config.ts). A strict Content-Security-Policy is not set because Next.js needs a per-request nonce for it.

---

## 🗺️ Roadmap

1. Accounts and a database (PostgreSQL + Prisma) so data syncs across devices
2. Bill splitting with settlement between friends
3. Receipt upload and OCR
4. Recurring transactions that add themselves
5. Multi-currency

---

## 📝 License

This project is for educational purposes.

**Developer:** 1st Year MCA Student, India · **Started:** December 6, 2025
