# Demo Demet Air

A modern desktop and web application built with Tauri, React, and TypeScript.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Shoelace UI
- **Backend**: Fastify + MongoDB + DDD Architecture
- **Desktop**: Tauri 2.8
- **Build Tool**: Vite
- **Package Manager**: pnpm

## Project Structure

```
demo-demet-air/
├── backend/              # Backend API (Fastify + MongoDB)
│   ├── src/
│   │   ├── api/          # REST API routes
│   │   ├── application/  # Application services
│   │   ├── domain/       # Domain entities & logic
│   │   ├── infrastructure/ # Infrastructure implementations
│   │   └── scripts/      # Database scripts
│   └── package.json
├── src/                  # Frontend React app
│   ├── api/              # API client
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   ├── services/         # Frontend services
│   ├── styles/           # Global styles
│   └── types/            # TypeScript types
├── src-tauri/            # Tauri desktop app
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9.0+
- MongoDB 6+
- Rust (for Tauri builds)

### Installation

```bash
# Install frontend dependencies
pnpm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Development

1. **Start MongoDB**:
```bash
mongod --dbpath /tmp/mongodb-demet-air --port 27018
```

2. **Setup Backend**:
```bash
cd backend
cp .env.example .env
npm run seed
ADMIN_EMAIL=admin@demo.com ADMIN_PASSWORD=password123 npm run create-admin
npm run dev
```

3. **Start Frontend**:
```bash
# In a new terminal
pnpm run dev
```

4. **Run Desktop App** (optional):
```bash
pnpm tauri:dev
```

### Build

```bash
# Build web app
pnpm run build

# Build desktop app
pnpm tauri:build

# Build backend
cd backend
npm run build
```

## Configuration

- Frontend runs on port `5201`
- Backend API runs on port `4001`
- MongoDB runs on port `27018`

## Environment Variables

See `.env.example` files in root and backend directories for all available configuration options.

## Documentation

See the `docs/` directory for detailed documentation.

## License

MIT
