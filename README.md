# React + TypeScript table UI

A Vite-powered React + TypeScript project that recreates the provided Figma table using [`@tanstack/react-table`](https://tanstack.com/table/latest). The experience includes live data loading, editable rows, animated country filtering, pagination, and reusable UI primitives that mirror the mock.

## Features
- Headless table powered by TanStack Table with entity, gender, request date, country, and edit columns
- Live rows from [`https://685013d7e7c42cfd17974a33.mockapi.io/taxes`](https://685013d7e7c42cfd17974a33.mockapi.io/taxes) with offline fallbacks
- Country multi-select filter fed by [`https://685013d7e7c42cfd17974a33.mockapi.io/countries`](https://685013d7e7c42cfd17974a33.mockapi.io/countries)
- Edit modal with name + country fields, PUT saves, and table refresh
- New customer modal launched from the toolbar with POST creates and auto-refresh
- Loading/error states, shimmer skeletons, pagination controls, and subtle modal/popover animations
- Reusable `Button` and `Input` primitives that match the Figma spacing and states

## Folder structure
```
Inkle/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── index.css
    ├── index.tsx
    ├── components/
    │   ├── Layout.tsx
    │   └── ui/
    │       ├── Button.tsx
    │       └── Input.tsx
    └── features/
        └── customers/
            ├── EditRequestModal.tsx
            ├── NewCustomerModal.tsx
            └── RequestsTable.tsx
```

## Setup
```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Type-check and build for production
npm run build

# Preview the production build
npm run preview
```

## Notes
- The table boots with fallback rows if the mock APIs are unreachable.
- Spacing, typography, colors, and shadows are tuned to closely mirror the Figma reference.
