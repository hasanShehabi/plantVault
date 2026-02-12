# PlantVault

PlantVault is a mobile-first React + TypeScript inventory system for mango trees and general plants.

## Stack

- React 18 + TypeScript + Vite
- React Router
- TanStack Query
- React Hook Form + Zod
- TailwindCSS
- Reusable component primitives (shadcn/ui-style)

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Roles

- User: browse/filter inventory, view details, create reservations, view own reservations
- Admin: create/edit plants, toggle availability, manage reservation statuses

Role selection is mocked via the welcome screen and persisted in local storage.

## Architecture

- `src/pages` route-level screens
- `src/features` hooks/forms/components per domain
- `src/api/repositories` repository interfaces + mock and Firebase stubs
- `src/api/mockData` seed data
- `src/types` shared domain models
- `src/components` reusable UI/layout/common components
- `src/lib` app providers and utilities

## Data Layer

The app uses repository abstractions:

- `PlantRepository`
- `ReservationRepository`

Current runtime uses in-memory mock repositories. Firebase repository files are included as TODO stubs for future migration.
