# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based blog application that uses the Notion API to fetch and display articles. The application is deployed on Cloudflare Pages and uses Mantine for UI components.

## Common Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Type checking
pnpm type-check

# Cloudflare Pages build
pnpm pages:build

# Preview locally with Cloudflare Pages
pnpm preview

# Deploy to Cloudflare Pages
pnpm deploy
```

## Environment Setup

Create a `.env.local` file with:
```
NEXT_PUBLIC_NOTION_TOKEN=<your-notion-token>
NEXT_PUBLIC_DATABASE_ID=<your-notion-database-id>
```

## Code Architecture

### Core Architecture Patterns

- **Repository Pattern**: Data access is abstracted through the `NotionRepository` in `src/lib/articles/repository.ts`
- **Service Layer**: Business logic is contained in `ArticleService` in `src/lib/articles/service.ts`
- **Presenter Layer**: Data transformation is handled by `ArticlePresenter` in `src/lib/articles/presenter.ts`
- **Dependency Injection**: Services are composed through factory functions in `src/lib/articles/index.ts`

### Key Design Principles

- **Result Type Pattern**: Uses `neverthrow` library for error handling instead of exceptions
- **Functional Programming**: Prefers pure functions over classes when possible
- **TypeScript Strict**: No `any` or `unknown` types, all types are explicitly defined
- **Immutable Data**: Uses immutable data structures and patterns

### Directory Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   └── ...
├── components/            # React components
│   ├── blocks/           # Notion block components
│   ├── blog/             # Blog-specific components
│   └── common/           # Shared components
├── lib/                  # Core business logic
│   └── articles/         # Article-related services
└── types/               # TypeScript type definitions
    └── notion/          # Notion API types
```

### Article System

The article system follows a layered architecture:

1. **Repository Layer** (`src/lib/articles/repository.ts`): Handles Notion API interactions
2. **Service Layer** (`src/lib/articles/service.ts`): Contains business logic and error handling
3. **Presenter Layer** (`src/lib/articles/presenter.ts`): Transforms Notion data to application models
4. **Factory Functions** (`src/lib/articles/index.ts`): Creates and configures service instances

### Error Handling

- All functions that can fail return `Result<T, E>` types from `neverthrow`
- Errors are typed and categorized (e.g., `NotionError`, `ApplicationError`)
- No exceptions are thrown; all errors are handled through the Result type

## Code Style Guidelines

### TypeScript

- Use strict typing - avoid `any` and `unknown`
- Prefer interfaces over types for object definitions
- Use branded types for domain-specific values
- Implement proper error types with discriminated unions

### React Components

- Use functional components with hooks
- Implement proper TypeScript props interfaces
- Use CSS modules for styling (`.module.css`)
- Follow Mantine component patterns

### Naming Conventions

- Use PascalCase for components and types
- Use camelCase for functions and variables
- Use kebab-case for file names
- Use UPPER_SNAKE_CASE for constants

## Testing

Currently no test framework is configured. When adding tests:
- Use the existing TypeScript configuration
- Test pure functions first
- Use in-memory implementations for repositories
- Mock external dependencies

## Deployment

- The application is configured for Cloudflare Pages deployment
- Uses `@cloudflare/next-on-pages` for Next.js compatibility
- Static site generation (SSG) is enabled
- Images are unoptimized for Cloudflare compatibility

## Code Formatting

- Uses Biome for linting and formatting
- Configuration is in `biome.json`
- Pre-commit hooks ensure code quality (configured in `lefthook.yml`)
- Indent style: 2 spaces
- No trailing semicolons preference

## Git Workflow

Commit message prefixes:
- `fix:` - Bug fixes
- `feat:` - New features
- `update:` - Feature updates
- `change:` - Specification changes
- `perf:` - Performance improvements
- `refactor:` - Code refactoring
- `docs:` - Documentation only
- `style:` - Code formatting
- `test:` - Test code changes
- `revert:` - Revert changes
- `chore:` - Other changes

## Development Notes

- The application uses Next.js 15 with App Router
- Mantine v7 is used for UI components
- SWR is used for data fetching and caching
- The codebase follows functional programming principles
- All external dependencies are abstracted through adapters
- Error handling is done through Result types, not exceptions