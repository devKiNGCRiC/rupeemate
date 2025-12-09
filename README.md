# 💰 RupeeMate - Your Smart Money Companion

**Track Expenses • Split Bills • Manage Your Finances**

A modern, full-stack web application built to help you manage your finances with ease. Track expenses, split bills with friends, and get smart insights about your spending patterns.

---

## 🎯 Project Overview

**RupeeMate** is being built as a learning project by a 1st year MCA student to master full-stack development while creating a practical, real-world application. The goal is to understand modern web technologies from the ground up.

### 🌟 Key Features (Planned)

#### Phase 1: Core Features (Months 1-2)
- ✅ **Expense Tracking** - Add, view, edit, and delete expenses
- 📊 **Categories** - Organize expenses by Food, Transport, Shopping, etc.
- 📅 **Date Filtering** - View expenses by day, week, month
- 💳 **Payment Methods** - Track cash, UPI, card payments
- 📈 **Simple Analytics** - Visual charts and spending summaries

#### Phase 2: User Management (Month 3)
- 🔐 **Authentication** - Secure user signup and login
- 👤 **Personal Dashboard** - Customized view for each user
- 💰 **Budget Setting** - Set monthly/category budgets
- 🔔 **Alerts** - Notifications when approaching budget limits

#### Phase 3: Bill Splitting (Month 4)
- 👥 **Groups** - Create groups for roommates, trips, friends
- 🧾 **Shared Expenses** - Add expenses and split equally/unequally
- 💸 **Settlement** - Track who owes whom
- ✅ **Settle Up** - Mark debts as paid

#### Phase 4: Advanced Features (Months 5-6)
- 📸 **Receipt Scanning** - Extract data from receipt photos (OCR)
- 🤖 **AI Insights** - Smart spending pattern analysis
- 📱 **SMS Parsing** - Auto-log UPI transactions (India)
- 🎯 **Savings Goals** - Track progress toward financial goals
- 🔄 **Recurring Transactions** - Auto-add monthly subscriptions
- 🌍 **Multi-Currency** - Support for international transactions

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components

### Backend
- **API**: Next.js API Routes (built-in)
- **Database ORM**: [Prisma](https://www.prisma.io/) - Type-safe database client
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Robust relational database
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) or [Clerk](https://clerk.dev/)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** v20+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server (with hot reload)
npm run build    # Build production version
npm run start    # Start production server
npm run lint     # Run ESLint for code quality
```

---

## 📁 Project Structure

```
rupeemate/
├── app/                   # Next.js App Router pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── api/              # API routes (future)
├── components/           # Reusable React components
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   └── utils.ts          # Common utilities
├── public/               # Static files
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

---

## 📚 Learning Journey

### What You'll Learn
- React & TypeScript fundamentals
- Next.js App Router and routing
- Tailwind CSS for styling
- Backend APIs with Next.js
- Database design with Prisma
- User authentication
- Deployment to production

---

## 📝 License

This project is for educational purposes.

---

## 📧 Contact

**Developer**: 1st Year MCA Student, India  
**Project Start Date**: December 6, 2025  
**Learning Journey**: From beginner to full-stack developer 🚀

---

**Happy Coding! Let's build something amazing together.** 💪
