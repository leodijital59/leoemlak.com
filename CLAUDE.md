# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LeoEmlak is a Turkish real estate listing application built with TanStack Start (React meta-framework with file-based routing) and Vite.

## Commands

```bash
# Development
pnpm dev              # Start dev server on port 3000
pnpm dev:open         # Start dev server and open browser

# Build & Production
pnpm build            # Build for production (vite build + tsc)
pnpm preview          # Preview production build
pnpm start            # Run production server

# Code Quality
pnpm typecheck        # Run TypeScript type checking
pnpm lint             # Run ESLint on src/**/*.{ts,tsx}

# Database (Drizzle ORM)
npx drizzle-kit generate   # Generate migrations from schema changes
npx drizzle-kit migrate    # Apply migrations to database
npx drizzle-kit push       # Push schema directly (dev only)
npx drizzle-kit studio     # Open Drizzle Studio GUI
```

## Architecture

### Tech Stack
- **Framework**: TanStack Start + React 19 + Vite 7
- **Routing**: TanStack Router (file-based, auto-generated `routeTree.gen.ts`)
- **Database**: PostgreSQL via Neon Serverless + Drizzle ORM
- **UI**: shadcn/ui (new-york style) + Radix UI primitives + Tailwind CSS 4
- **Forms**: react-hook-form + zod
- **Auth**: Neon Auth (@neondatabase/neon-js/auth)
- **Rich Text Editor**: Plate.js (slate-based editor with plugins)
- **File Upload**: Vercel Blob Storage (@vercel/blob)

### Directory Structure
```
src/
├── routes/           # TanStack Router file-based routes
│   ├── (app)/        # Public routes (home, listings, property details)
│   ├── (auth)/       # Auth routes (login, register)
│   └── admin/        # Protected admin panel (requires auth)
├── components/
│   ├── ui/           # shadcn/ui components (90+ components including Plate.js editor nodes)
│   ├── admin/        # Admin-specific form components (PropertyForm, CategoryForm, FeatureForm, etc.)
│   ├── property/     # Property-related components
│   ├── home/         # Homepage components
│   └── common/       # Shared components
├── lib/
│   ├── server/       # Server-side business logic (createServerFn handlers)
│   ├── validations/  # Zod schemas for form validation
│   ├── client/       # Client-side utilities (use-property-filters.ts, user.ts)
│   ├── utils.ts      # cn() and general utilities
│   └── format.ts     # Data formatting helpers
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── data/             # Static data (location lists)
├── schema.ts         # Drizzle ORM database schema
├── db.ts             # Database connection (Neon)
├── auth.ts           # Auth client configuration
└── router.tsx        # TanStack Router configuration (custom search param serialization)
```

### Database Schema (src/schema.ts)
Core tables with hierarchical and relational structure:
- `categoriesTable` - Hierarchical property categories (self-referential with `parentId`)
- `propertiesTable` - Property listings with all details (references `categoriesTable`)
- `propertyImagesTable` - Multiple images per property (cascade delete on property deletion)
- `propertyFeaturesTable` - Dynamic amenity/feature definitions (shared across properties)
- `propertyPropertyFeaturesTable` - Many-to-many junction for property features with boolean `value` field
- `categoryFeaturesTable` - Many-to-many junction for category-specific features

Key enums: `listingTypeEnum` (sold/rented), `listingStatusEnum` (active/passive), `heatingTypeEnum`

All tables use UUID primary keys with `defaultRandom()`. Relations are defined using Drizzle's `relations()` API.

### Path Aliases
Configured in tsconfig.json and vite.config.ts:
- `@/` → `src/`

### Styling
- Public pages: Bootstrap 5 + custom SCSS (`src/styles/`)
- Admin panel: Tailwind CSS 4 + shadcn/ui (`src/styles/admin.css`)
- Use `cn()` utility from `@/lib/utils` for conditional classes

### Environment Variables
Required in `.env` (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `VITE_NEON_AUTH_URL` - Neon Auth URL (client-side)
- `NEON_AUTH_BASE_URL` - Neon Auth base URL (server-side)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage token for image uploads
- `VITE_APP_NAME` - Application display name (client-side)

## Key Patterns

### Server Functions (TanStack Start)
Business logic lives in `src/lib/server/*.ts` using `createServerFn()`:
- Always use `.inputValidator()` for type-safe inputs (Zod schemas from `src/lib/validations/`)
- Return plain objects (serializable data only)
- Handle errors with appropriate HTTP responses
- Example: `createProperty`, `updateProperty`, `deleteProperty` in `src/lib/server/property.ts`

### Form Handling
All admin forms follow this pattern:
1. Define Zod schema in `src/lib/validations/<entity>.ts`
2. Create form component in `src/components/admin/<Entity>Form.tsx`
3. Use `react-hook-form` with `@hookform/resolvers/zod`
4. Submit to server function via `createServerFn()`
5. Handle success/error states with toast notifications

**Important**: Admin forms that include file uploads use `FormData` submission (not JSON). Image files and metadata are passed separately; features are submitted as `{featureId, value}` pairs.

### Adding New Routes
Create files in `src/routes/` following TanStack Router conventions:
- `index.tsx` - Index route for directory
- `route.tsx` - Layout wrapper with `<Outlet />`
- `$param.tsx` - Dynamic parameter route
- `$.tsx` - Catch-all route

Route tree auto-regenerates on file changes.

`router.tsx` overrides `stringifySearch`/`parseSearch` to handle nested objects in URL params (e.g., `features[id1]=true&features[id2]=false`). Property search filters are managed client-side via `src/lib/client/use-property-filters.ts`.

### Admin Authentication
Admin routes (`/admin/*`) are protected by `NeonAuthUIProvider`. Use `<SignedIn>` and `<SignedOut>` components for conditional rendering.

### Image Upload Pattern
Property images use Vercel Blob Storage:
1. Client uploads images to blob storage via `put()` from `@vercel/blob`
2. Form submits image URLs + metadata to server function
3. Server function inserts into `propertyImagesTable` with order and `isMainImage` flag
4. Delete operations use `del()` to clean up blob storage

### Rich Text Editor (Plate.js)
Use `EditorField` component from `src/components/admin/EditorField.tsx`:
- Provides modular plugin kits (basic, list, indent, link)
- Returns JSON value compatible with Plate.js
- Static rendering via `editor-static.tsx` component
- Store editor value as JSON text in database

## Database Workflow

### Schema Changes
1. Modify `src/schema.ts`
2. Run `npx drizzle-kit generate` to create migration files in `migrations/`
3. Review generated SQL in `migrations/0000_*.sql`
4. Apply migrations with `npx drizzle-kit migrate`
5. Commit both schema.ts and migration files

**Important**: Never delete old migration files. Always create new migrations for schema changes.

## Testing

There is no test suite in this project. Use `pnpm typecheck` and `pnpm lint` for code quality checks.