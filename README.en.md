# Inventory Management with SvelteKit

A comprehensive inventory management and e-commerce system built with SvelteKit. This application allows businesses to manage their inventory, process sales, handle buybacks, track financial transactions, and generate reports.

## Features

- User authentication and permission management
- Inventory management
- Sales processing
- Buyback tracking
- Financial transaction monitoring
- PDF report generation
- Customer and supplier relationship management
- Dashboard with analytics

## Technologies

- **Frontend**: SvelteKit, Tailwind CSS, Skeleton UI
- **Backend**: Node.js, SvelteKit (SSR)
- **Database**: SQLite (better-sqlite3)
- **Authentication**: Custom session-based authentication
- **Form Validation**: Zod, sveltekit-superforms
- **UI Components**: @skeletonlabs/skeleton, @vincjo/datatables
- **PDF Generation**: pdfmake
- **Charts**: Chart.js
- **Date/Time**: Luxon
- **Testing**: Vitest, Playwright
- **Other Tools**: Vite, ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (currently pnpm and yarn conflict with sqlite)

### Installation

1. Clone the repository:
```sh
git clone https://github.com/glenn-f/svelte-skeleton 
cd svelte_skeleton
```

2. Install dependencies:
```sh
npm install
```

3. Create a `.env` file in the root directory (use `.env.example` as a template):
```sh
cp .env.example .env
```

4. Initialize the database (sqlite):
```sh
npm run db:refresh
```

### Development

Run the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified in your config).

### Building for Production

Build the application:
```sh
npm run build
```

### Running in Production

Start the application in production mode:
```sh
npm start
```

## Other Commands

- **Preview production build**: `npm run preview`
- **Run tests**: `npm run test`
- **Run unit tests**: `npm run test:unit`
- **Lint code**: `npm run lint`
- **Format code**: `npm run format`
- **Reset database**: `npm run db:refresh`

## Project Structure

- `src` - Application source code
  - `/lib` - Shared libraries and components
    - `/server` - Server-side code
    - `/relatorios` - Report generation
    - `/zod` - Validation schemas
  - `/routes` - SvelteKit routes
  - `static` - Static assets
- `tests` - Test files
- `build` - Production build output
- `prisma` - Prisma schema and migrations

### Project Status

The system is currently functional but still incomplete. Some core functionalities are already implemented and operational, but there's ongoing work to expand and improve the system.

- Library updates are pending to ensure compatibility and security
- Completion of the full project scope is in progress
- New modules are being developed according to established priorities
- Performance optimizations will be applied after completing the main functionalities

Contributors are welcome to help complete the pending aspects of the system.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
