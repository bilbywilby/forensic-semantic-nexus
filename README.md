# Cloudflare Workers React Boilerplate

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/forensic-semantic-nexus)]](https://deploy.workers.cloudflare.com)

A production-ready full-stack boilerplate for building scalable applications on Cloudflare Workers. Features a React frontend with shadcn/ui, Durable Objects for stateful entities (Users, Chats, Messages), and a Hono-based API backend.

## 🚀 Key Features

- **Durable Objects Entities**: User management and ChatBoards with real-time message storage using a shared GlobalDurableObject for multi-tenant efficiency.
- **Indexed Listing**: Efficient pagination and listing of entities with cursor-based queries.
- **Type-Safe Full-Stack**: Shared TypeScript types between frontend and worker.
- **Modern React Frontend**: Vite + React 18 + TypeScript + Tanstack Query + shadcn/ui + Tailwind CSS.
- **API-First Backend**: Hono router with CORS, logging, and error handling.
- **Mock Data Seeding**: Automatic population of sample users and chats.
- **Deployment Ready**: One-command deploy to Cloudflare Workers with Pages integration.
- **Theme Support**: Dark/light mode with localStorage persistence.
- **Error Reporting**: Built-in client error capture and logging.

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tanstack Query (data fetching/caching)
- shadcn/ui + Tailwind CSS + Lucide Icons
- React Router + Framer Motion
- Sonner (toasts) + Zustand (state)

### Backend
- Cloudflare Workers
- Hono (routing)
- Durable Objects (GlobalDurableObject + IndexedEntity pattern)
- SQLite migrations

### Tools
- Bun (package manager/runtime)
- Wrangler (CLI)
- ESLint + TypeScript strict mode

## 📦 Installation

1. **Clone & Install Dependencies**:
   ```bash
   git clone <your-repo-url>
   cd <project-name>
   bun install
   ```

2. **Type Generation** (for Workers env):
   ```bash
   bun run cf-typegen
   ```

## 🔄 Development

1. **Start Dev Server** (frontend + worker proxy):
   ```bash
   bun dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

2. **Build for Production**:
   ```bash
   bun build
   ```

3. **Preview Production Build**:
   ```bash
   bun preview
   ```

## 📚 Usage Examples

### API Endpoints (prefix: `/api`)

- **Users**:
  - `GET /api/users?cursor=&limit=10` - List users
  - `POST /api/users` - `{ "name": "John" }`
  - `DELETE /api/users/:id`

- **Chats**:
  - `GET /api/chats?cursor=&limit=10` - List chats
  - `POST /api/chats` - `{ "title": "My Chat" }`
  - `GET /api/chats/:chatId/messages` - List messages
  - `POST /api/chats/:chatId/messages` - `{ "userId": "u1", "text": "Hello" }`

- **Health**: `GET /api/health`
- **Client Errors**: `POST /api/client-errors`

### Frontend Integration
Use `api()` helper from `@/lib/api-client`:
```tsx
import { api } from '@/lib/api-client';

const users = await api<User[]>('/api/users');
```

## ☁️ Deployment

1. **Login to Cloudflare**:
   ```bash
   bunx wrangler login
   ```

2. **Deploy**:
   ```bash
   bun deploy
   ```
   Deploys Worker + static assets to Cloudflare Pages.

3. **One-Click Deploy**:
   [![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/forensic-semantic-nexus)]](https://deploy.workers.cloudflare.com)

### Configuration
- Edit `wrangler.jsonc` for custom bindings/migrations.
- Set `wrangler.toml` for secrets: `wrangler secret put <NAME>`.

## 🤝 Contributing

1. Fork & clone.
2. `bun install`.
3. Add routes to `worker/user-routes.ts`.
4. Extend entities in `worker/entities.ts`.
5. Frontend: Edit `src/pages/HomePage.tsx` + add routes.
6. Test: `bun dev`.
7. PR with clear description.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- Star this repo ⭐