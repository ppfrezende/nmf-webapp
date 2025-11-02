# 🧠 no-more-failures

#### Web interface for no-more-failures, a personal study-management platform built to track performance, study cycles, topics, and question attempts.

Designed for speed, scalability, and a clean, distraction-free learning experience.

![Sign-in Page](/public/sign-in-page.png 'SignIn Page')

#### 🚀 Tech Stack

- Next.js (App Router)
- React / TypeScript
- Tailwind CSS
- shadcn/ui – modern component system
- TanStack Query (React Query) – data fetching and caching
- Context API – global state management
- date-fns – date utilities
- Axios – API client

#### 🎯 Key Features

- 📊 Performance dashboard – study hours, accuracy, and trends
- 📚 Disciplines & topics management – track progress by subject
- 🔁 Dynamic study cycles – rotate subjects automatically
- 🧩 Question attempts tracking – record right/wrong answers per topic
- 🧠 Smart metrics – consistency and performance insights
- ☁️ REST API integration with backend (Fastify/Prisma)

#### 🔮 Future features

- Sign-in with Google
- Timed study sessions – start, pause, and analyze your sessions
- Advanced performance charts and analytics
- PWA / Offline mode
- Daily progress timeline
- Export metrics as PDF

#### ⚙️ Getting Started

1. Requirements
   -> Node.js (LTS)
   -> pnpm or npm
   -> Backend running locally (port set in .env.local)

2. Environment Variables (.env.local)
   -> `NEXT_PUBLIC_API_URL=http://localhost:3333`

3. Installation
   -> `pnpm install`

4. Development
   -> `pnpm run dev`

5. Production Build
   -> `pnpm run build` && `pnpm run start`

#### 🧩 Coding Conventions

- All API calls centralized in services/api.ts
- Data logic extracted into dedicated hooks (e.g. useDisciplines, useCycles, etc.)
- Modular, composable components
- Responsive design powered by Tailwind CSS - Shadcn/ui
- Layout with Sidebar + Header + Dynamic Breadcrumb

#### 💡 Project Vision

no-more-failures was created to bring structure and analytics to long-term study goals — enabling full tracking of cycles, progress, errors, and consistency in one unified ecosystem.

💭 Feel free to contribute.
