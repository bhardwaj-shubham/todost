# Todost

A todo app built with Next.js that goes a step beyond basic task lists — it uses the Google Gemini API to suggest tasks you might have forgotten, and syncs instantly across devices via Convex.

## Features

- **AI-powered suggestions** — Gemini API suggests new tasks based on your current todo list
- **Real-time sync** — changes reflect instantly across devices via Convex, with automatic conflict resolution
- **Authentication** — NextAuth v5, supporting GitHub/Google OAuth and email login
- **Task management** — create, update, complete, and filter tasks by status and date
- **Responsive UI** — Tailwind CSS + Radix UI, dark mode supported

## Tech Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Backend/Database:** Convex (real-time backend)
- **Auth:** NextAuth v5
- **AI:** Google Generative AI (Gemini API)
- **UI:** Tailwind CSS, Radix UI
- **Forms/Validation:** React Hook Form, Zod

## Getting Started

### Prerequisites

- Node.js 18+
- A Convex account
- A Google Gemini API key
- (Optional) GitHub/Google OAuth app credentials

### Setup

```bash
git clone https://github.com/bhardwaj-shubham/todost.git
cd todost
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
GOOGLE_API_KEY=your_google_api_key
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Optional OAuth
GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret
GOOGLE_OAUTH_ID=your_google_oauth_id
GOOGLE_OAUTH_SECRET=your_google_oauth_secret
```

```bash
npm run dev
```

Runs on `http://localhost:3000`.

## Project Structure

```
todost/
├── app/
│   ├── api/auth/         # NextAuth routes
│   └── components/       # TodoForm, TodoList, TodoItem, etc.
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Convex client
│   └── ai.ts             # Gemini API integration
├── convex/
│   ├── schema.ts         # Database schema
│   └── todos.ts          # Mutations and queries
└── public/
```

## How the AI suggestions work

The app sends your current list of todos to Gemini with a prompt asking for related tasks you might be missing — not random suggestions, but ones grounded in what's already on your list. This keeps the feature from feeling like a novelty bolt-on.

## What I'd improve next

- Cache/rate-limit Gemini calls so suggestions aren't re-fetched unnecessarily
- Add recurring tasks and calendar integration (currently on the roadmap, not built)
- Add tests around the Convex mutations

## License

MIT
