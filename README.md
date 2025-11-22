# React + TypeScript table starter

This repo scaffolds a Vite-powered React + TypeScript project that recreates the provided Figma table using [`@tanstack/react-table`](https://tanstack.com/table/latest). The table pulls rows from [`https://685013d7e7c42cfd17974a33.mockapi.io/taxes`](https://685013d7e7c42cfd17974a33.mockapi.io/taxes) with a local fallback so it still renders when offline.

## What you get
- React 18 with TypeScript and Vite dev server
- `@tanstack/react-table` wired to live data from the mock API plus offline fallback rows
- Minimal styling that mirrors the Figma badges, spacing, and edit affordance
- Ready-to-extend layout shell and feature folder for the table

## Recommended libraries
- [`@tanstack/react-table`](https://tanstack.com/table/latest) for headless table logic
- [`react-icons`](https://react-icons.github.io/react-icons) for lightweight SVG icons
- [`clsx`](https://github.com/lukeed/clsx) for conditional class names

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
    │   └── Layout.tsx
    └── features/
        └── customers/
            └── RequestsTable.tsx
```

## Setup commands
```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

## Next steps
- Wire the edit icon to a modal or dedicated route for updating a request.
- Extend the schema/columns if the upstream API adds more fields.
- Extract shared UI primitives (badges, buttons, popovers) if you plan to reuse them elsewhere.
