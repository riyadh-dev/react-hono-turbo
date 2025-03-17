# React Hono Turbo

![BookDex](https://res.cloudinary.com/riyadh-main-cloud/image/upload/f_webp/q_auto:best/portfolio/react-hono-turbo/sv20bs8dadfufythx0xq.png)

A modern full-stack monorepo template powered by Turborepo, React, Hono, and PostgreSQL.

## Features

- **Monorepo Architecture**: Managed with Turborepo for efficient workspace handling
- **Frontend**: React with Vite, Tailwind CSS, and React Compiler
- **Backend**: Hono framework for high-performance APIs
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Async State Management**: TanStack Query for data fetching and caching
- **Routing**: TanStack Router for type-safe routing
- **Forms**: TanStack Form for form state management
- **Validation**: Zod for schema validation and type safety
- **RPC**: End-to-end type-safe API calls
- **Code Quality**: ESLint, Prettier, and spell checking configured

## Getting Started

### Prerequisites

- Bun
- PostgreSQL

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/riyadh-dev/react-hono-turbo
    cd react-hono-turbo
    ```

2. Install dependencies:

    ```bash
    bun install
    ```

3. Set up environment variables:

    - Create `.env` file in the `apps/api` directory with the following variables:

        ```
        # PostgreSQL connection string
        DATABASE_URL=

        # URL of the client, used for CORS
        CLIENT_ORIGIN=

        # Port to listen on
        API_PORT=

        # Secret used to sign cookies
        COOKIE_SECRET=

        # Secret used to sign JWT tokens
        TOKEN_SECRET=

        # Expiration time in ms for cookies
        COOKIE_EXP=

        # Expiration time in ms for JWT tokens
        TOKEN_EXP=
        ```

    - Create `.env` file in the `apps/web` directory with the following variables:
        ```
        # The URL of the API
        VITE_API_URL=
        ```

4. Start the development environment:
    ```bash
    bun dev
    ```

## Project Structure

```
├── apps/
│   ├── web/            # React frontend application
│   └── api/            # Hono API server
├── packages/
│   ├── eslint-config/  # Shared ESLint configuration
└── package.json        # Root package.json
```

## Development

- **Frontend**: Run `cd apps/web && bun dev` to start the React development server
- **API**: Run `cd apps/api && bun dev` to start the Hono API server
- **Full Stack**: Run `bun dev` to start both frontend and backend

## Database

The project uses PostgreSQL with Drizzle ORM:

- **Migrations**: Run `bun db:migrate` to apply database migrations
- **Push Schema**: Run `bun db:push` to push the current schema to the database
- **Seed Data**: Run `bun db:seed` to seed the database with sample data
- **Drizzle Studio**: Run `bun db:studio` to open Drizzle Studio
