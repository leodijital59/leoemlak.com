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

### Directory Structure
```
src/
├── routes/           # TanStack Router file-based routes
│   ├── (app)/        # Public routes (home, listings, property details)
│   ├── (auth)/       # Auth routes (login, register)
│   └── admin/        # Protected admin panel (requires auth)
├── components/
│   ├── ui/           # shadcn/ui components (50+ components)
│   ├── property/     # Property-related components
│   │   └── dashboard/# Admin dashboard components
│   ├── home/         # Homepage components
│   └── common/       # Shared components
├── schema.ts         # Drizzle ORM database schema
├── db.ts             # Database connection (Neon)
├── auth.ts           # Auth client configuration
└── router.tsx        # TanStack Router configuration
```

### Database Schema (src/schema.ts)
Main tables:
- `propertiesTable` - Property listings with all details
- `propertyImagesTable` - Multiple images per property (cascade delete)
- `propertyFeaturesTable` - Dynamic amenity/feature definitions
- `propertyPropertyFeaturesTable` - Many-to-many junction for features

Key enums: `propertyTypeEnum`, `listingTypeEnum`, `listingStatusEnum`, `heatingTypeEnum`, `buildingAgeEnum`

### Path Aliases
Configured in tsconfig.json:
- `@/` → `src/`
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`

### Styling
- Public pages: Bootstrap 5 + custom SCSS (`src/styles/`)
- Admin panel: Tailwind CSS + shadcn/ui (`src/styles/admin.css`)
- Use `cn()` utility from `@/lib/utils` for conditional classes

### Environment Variables
Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `VITE_NEON_AUTH_URL` - Neon Auth URL (client-side)
- `NEON_AUTH_BASE_URL` - Neon Auth base URL (server-side)

## Key Patterns

### Adding New Routes
Create files in `src/routes/` following TanStack Router conventions:
- `index.tsx` - Index route for directory
- `route.tsx` - Layout wrapper with `<Outlet />`
- `$param.tsx` - Dynamic parameter route
- `$.tsx` - Catch-all route

Route tree auto-regenerates on file changes.

### Admin Authentication
Admin routes (`/admin/*`) are protected by NeonAuthUIProvider. Use `<SignedIn>` and `<SignedOut>` components for conditional rendering.

### Form Components
Property forms use a tab-based wizard pattern in `src/components/property/dashboard/dashboard-add-property/`:
1. PropertyDescription - Basic info
2. UploadMedia - Images and video
3. LocationField - Map integration with @react-google-maps/api
4. DetailsFiled - Property specifications
5. Amenities - Feature selection