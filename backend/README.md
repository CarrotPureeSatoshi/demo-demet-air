# Demo Demet Air - Backend

Backend API built with Fastify, MongoDB, and DDD Architecture.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start MongoDB
mongod --dbpath /tmp/mongodb-demet-air --port 27018

# Seed database
npm run seed

# Create admin user
ADMIN_EMAIL=admin@demo.com ADMIN_PASSWORD=password123 npm run create-admin

# Start development server
npm run dev
```

## Architecture

This backend follows Domain-Driven Design (DDD) principles:

- `domain/` - Domain entities, aggregates, value objects, and repository interfaces
- `application/` - Application services and use cases
- `infrastructure/` - Infrastructure implementations (MongoDB, email, storage, etc.)
- `api/` - REST API routes and middleware

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Seed database with test data
- `npm run create-admin` - Create admin user
