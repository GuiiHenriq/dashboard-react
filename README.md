## Dashboard React + NextJS

## Features

- 🔐 **Sign-up / Sign-in Page** - ✅
- 👥 **User Management Dashboard** - ✅
- 🌙 **Theme customization** - ✅
- 🧪 **Testing** - ✅

## 🚀 Deploy
https://dashboard-react-guilhermeerba.vercel.app/

## 🛠️ Stack

- **Framework**: Next.js 15 with App Router
- **Language**: Typescript
- **Styling**: Tailwind CSS4
- **E2E Tests**: Cypress
- **Unit Tests**: Jest
- **Validation**: Zod
- **State Management**: React Context API

## 📌 Requirements

- Node.js 18+ 
- npm or yarn

## 🚀 How to Run

1. Clone the repository:
```bash
git clone https://github.com/GuiiHenriq/dashboard-react.git
cd dashboard-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_API_URL=https://reqres.in/api
REQRES_API_KEY=reqres-free-v1
```

### 🧪 Unit Tests (Jest)

Run unit tests for components and utilities:
*Only tested minimum coverage*

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### 🎨 E2E Tests (Cypress)

Run end-to-end tests to verify complete user workflows:

```bash
# Run E2E tests (requires dev server running)
npm run test:e2e

# Open Cypress Test Runner
npm run test:e2e:open

# Run Cypress tests headlessly
npm run cypress:run

# Run only E2E tests
npm run cypress:run:e2e
```

## 🏗️ Architecture

```
├── __tests__/             # Jest unit tests
├── app/                   # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── api/               # API routes
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── types/                 # TypeScript type definitions
├── cypress/               # Cypress test files
│   ├── e2e/              # End-to-end tests
│   ├── component/        # Component tests
│   ├── fixtures/         # Test data
│   └── support/          # Test utilities
```

## Authentication

The app includes a complete authentication system with:

- **Login page** (`/auth/login`)
- **Registration page** (`/auth/register`)
- **Protected routes** - Automatic redirection for unauthenticated users
- **Form validation** - Client-side validation with Zod
- **Error handling** - User-friendly error messages


## API Integration

The application integrates with the [ReqRes API](https://reqres.in/) for demonstration purposes:

- **Authentication**: POST `/api/auth/login`, `/api/auth/register`
- **Users**: GET, POST, PUT, DELETE `/api/users`


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.